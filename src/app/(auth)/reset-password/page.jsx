'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Axios from '@/lib/Axios';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ResetPasswordSchema } from '@/lib/Validations';

const ResetPassword = () => {
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get('token');
  const [isValidTokenLoading, setIsValidTokenLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(true);
  const [userId, setUserId] = useState('');

  const verifyResetPasswordToken = async () => {
    const payload = {
      token: resetPasswordToken,
    };
    try {
      setIsValidTokenLoading(true);
      const response = await Axios.post(
        '/api/auth/verify-forgot-password-token',
        payload
      );

      if (response.status === 200) {
        setUserId(response?.data?.userId);
        setIsExpired(response?.data?.expired);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setIsValidTokenLoading(false);
    }
  };

  // Verify token
  useEffect(() => {
    if (resetPasswordToken) {
      verifyResetPasswordToken();
    } else {
      router.push('/forgot-password');
    }
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values) {
    const payload = {
      userId: userId,
      password: values.password,
    };

    try {
      setIsLoading(true);
      const response = await Axios.post('/api/auth/reset-password', payload);

      if (response.status === 200) {
        toast.success(response.data.message);
        form.reset();
        router.push('/sign-in');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center text-primary-100">
        Reset Password
      </h1>

      {isValidTokenLoading ? (
        <Card>
          <p className="mx-auto w-fit">Loading..</p>
        </Card>
      ) : isExpired ? (
        <Card>
          <p className="mx-auto w-fit">Link is expired.</p>
        </Card>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-primary-500'}>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                      type="password"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={'text-primary-500'}>
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your confirm password"
                      {...field}
                      disabled={isLoading}
                      type="password"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer bg-primary-100/80 hover:bg-primary-100"
            >
              {isLoading ? 'Loading...' : 'Reset Password'}
            </Button>
          </form>
        </Form>
      )}

      <div className="max-w-md mx-auto">
        <p>
          Already have account ?{' '}
          <Link href={'/sign-in'} className="text-primary-500 drop-shadow-md">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
