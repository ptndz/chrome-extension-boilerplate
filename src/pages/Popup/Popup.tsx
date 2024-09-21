import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import UserAuthForm from '../../components/user-auth-form';
import { useStorage, withErrorBoundary, withSuspense } from '../../lib/shared';
import { userStorage } from '../../lib/storage';
import { User } from '../../lib/storage/types';

const Popup = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const user = useStorage(userStorage);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    (async () => {
      if (user.accessToken) {
        setLoading(false);
        setCurrentUser(user);
      } else {
        setLoading(false);
      }
    })();
  }, [user]);
  async function handleLogout() {
    setCurrentUser(undefined);
    await userStorage.clear();
  }
  return (
    <div>
      {isLoading && <div className="loader"></div>}
      {!isLoading && currentUser && (
        <div className="w-full max-w-3xl mx-auto py-8 px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.image} alt="User Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {currentUser.username}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleLogout}> Logout</Button>
          </div>
        </div>
      )}
      {!isLoading && !currentUser && (
        <UserAuthForm setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div className="loader"></div>),
  <div> Error Occur </div>
);
