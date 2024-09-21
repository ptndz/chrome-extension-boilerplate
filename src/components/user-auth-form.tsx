import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { userStorage } from '../lib/storage';
import { User } from '../lib/storage/types';
import { login } from '../services';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
const formSchema = z.object({
  username: z
    .string()
    .min(4, { message: 'Username must be at least 4 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }), // Add this line
});

type UserFormValue = z.infer<typeof formSchema>;
type Props = {
  setCurrentUser: (user: User) => void;
};
export default function UserAuthForm({ setCurrentUser }: Props) {
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    username: 'ptndev18@gmail.com',
    password: '123456789', // Add this line
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    const res = await login(data.username, data.password);

    setLoading(true);
    await userStorage.setUser(res);
    setCurrentUser(res);
  };

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your username..."
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password..."
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button className="ml-auto w-full" type="submit">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
