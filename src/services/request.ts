import { userStorage } from '../lib/storage';
const baseApi = process.env.REACT_APP_API_URL;

export type RequestHeaders = Record<string, string>;

export interface RequestOptions {
  headers?: RequestHeaders;
  disableErrorNotification?: boolean;
}

export type ResponseError = {
  code?: string;
  message: string;
  detail?: string;
};

export type Result<T = any> =
  | {
      error?: ResponseError | string;
      data?: T;
    }
  | T;

export interface RequestData {
  [key: string]: any;
}
const getRequestHeader = async (
  headers?: RequestHeaders,
  data?: any
): Promise<RequestHeaders> => {
  const accessToken = await userStorage.getAccessToken();
  const requestHeaders: {
    [key: string]: string;
  } = {
    'Content-Type': 'application/json;charset=utf-8',
    ...(headers ?? {}),
  };

  if (data instanceof FormData) {
    delete requestHeaders['Content-Type'];
  }

  if (accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  return requestHeaders;
};

const getErrorMessage = (
  error: ResponseError | string,
  defaultMessage = ''
) => {
  if (typeof error === 'string') {
    return error;
  }

  return error.message ?? defaultMessage;
};

export const createRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T | Response> => {
  let response: Response | null = null;
  const requestInit: RequestInit = {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: await getRequestHeader(options?.headers ?? {}, data),
    redirect: 'follow',
    referrerPolicy: 'strict-origin-when-cross-origin',
  };

  if (data) {
    if (data instanceof FormData) {
      requestInit.body = data;
    } else {
      requestInit.body = JSON.stringify(data);
    }
  }

  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = baseApi + url;
    }

    response = await fetch(url, requestInit);
    console.log('response', response);

    if (!response.ok) {
      if (response.status === 401) {
        if (Date.now() > (await userStorage.getAccessTokenExpires())) {
          const token = await refreshAccessToken();
          if (token.error) {
            throw new Error(token.error);
          }
          return createRequest(method, url, data, options);
        }
      }
      let errorMessage = response.statusText ?? 'Network response was not ok';
      try {
        const errorResponse = await response.json();
        errorMessage = getErrorMessage(errorResponse.error, errorMessage);
      } catch (e) {
        console.log(e);
      }

      throw new Error(errorMessage);
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const result: Result<T> = await response.json();

      if ((result as { error: ResponseError }).error) {
        throw new Error(
          getErrorMessage((result as { error: ResponseError }).error)
        );
      }

      return (result as { data: T }).data ?? (result as T);
    } else {
      return response;
    }
  } catch (e: any) {
    let errorMessage = '';

    if (!options?.disableErrorNotification) {
      console.log({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: getErrorMessage(
          e.message,
          'An error occurred. Please try again later.'
        ),
      });
    }

    if (e instanceof Error) {
      errorMessage = e.message;
    }

    const networkError = errorMessage.includes('Failed to fetch');
    networkError &&
      getErrorMessage(e.message, 'An error occurred. Please try again later.');

    throw new Error(errorMessage);
  }
};
async function refreshAccessToken() {
  const accessToken = await userStorage.getAccessToken();
  const refreshToken = await userStorage.getRefreshToken();
  try {
    const res = await fetch(`${baseApi}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });
    const refreshedTokens = await res.json();
    if (!res.ok) {
      throw refreshedTokens;
    }
    await userStorage.setTokens(
      refreshedTokens.data.accessToken,
      refreshedTokens.data.refreshToken,
      refreshedTokens.data.expires_in
    );
    return {
      accessToken: refreshedTokens.data.accessToken,
      refreshToken: refreshedTokens.data.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      error: 'RefreshAccessTokenError',
    };
  }
}
export const isNetworkError = (error: Error) => {
  return error.message.includes('Failed to fetch');
};

export const isAuthError = (error: Error) => {
  const message = (error.message ?? '').toLocaleLowerCase();
  return message.includes('401') || message.includes('unauthorized');
};

export const Get = async <T>(
  url: string,
  options?: RequestOptions
): Promise<T> => {
  const response = await createRequest('GET', url, null, options);

  return response as T;
};

export const Post = async <T>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> => {
  const response = await createRequest('POST', url, data, options);
  return response as T;
};

export const Put = async <T>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> => {
  const response = await createRequest('PUT', url, data, options);
  return response as T;
};

export const Delete = async <T>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> => {
  const response = await createRequest('DELETE', url, data, options);
  return response as T;
};
