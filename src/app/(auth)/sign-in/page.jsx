'use client';

import React, { useState } from 'react';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string({ message: 'Email is required.' }).email().min(5).max(50),
  password: z
    .string({ message: 'Password is required.' })
    .min(8, { message: 'Password must be atleast 8 characters.' })
    .regex(/[A-Z]/, 'Password should have least One Uppercase')
    .regex(/[a-z]/, 'Password should have atleast One Lowercase')
    .regex(/[0-9]/, 'Password should have atleast One Number.')
    .regex(/[@#$%^&*]/, 'Password should have atleast One Special Character.'),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({ resolver: zodResolver(formSchema) });
  const router = useRouter();

  async function onFormSubmit(values) {
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Login Successfully.');
      router.push('/');
    }
    setIsLoading(false);
  }

  return (
    <div className="lg:p-10 space-y-7">
      <h1 className="text-xl font-semibold text-center text-primary-500">
        Login
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="space-y-4 max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={'text-primary-500'}>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Email"
                    {...field}
                    value={field.value ?? ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={'text-primary-500'}>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Password"
                    {...field}
                    value={field.value ?? ''}
                    type="password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="ml-auto w-fit -mt-3">
            <Link href={'/forgot-password'} className="hover:underline">
              Forgot Password ?
            </Link>
          </div>
          <Button
            disabled={isLoading}
            className="w-full cursor-pointer primary-gradient rounded-lg text-light-900"
            type="submit"
          >
            {isLoading ? 'Loading..' : 'Login'}
          </Button>
        </form>
      </Form>
      <div className="max-w-md mx-auto">
        <p>
          Don't have account?{' '}
          <Link href={'/sign-up'} className="text-primary-500 drop-shadow-md">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
