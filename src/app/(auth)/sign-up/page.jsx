'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useRouter } from 'next/navigation';
import Axios from '@/lib/Axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const formSchema = z
  .object({
    name: z.string({ message: 'Name is required' }).min(3),
    email: z.string({ message: 'Email is required' }).email().min(5).max(50),
    password: z
      .string({ message: 'Password is required' })
      .min(8, { message: 'Password must at least 8 characters' })
      .regex(/[A-Z]/, 'Password at least One Uppercase')
      .regex(/[a-z]/, 'Password at least One Lowercase')
      .regex(/[0-9]/, 'Password at least One Number')
      .regex(/[@#$%^&*]/, 'Password at least One Special Character'),
    confirmPassword: z.string({ message: 'Confirm password is required' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password and confirm password must be same',
    path: ['confirmPassword'],
  });

const SignUp = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values) {
    console.log(values);
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      setIsLoading(true);
      const response = await Axios.post('/api/auth/signup', payload);

      if (response.status === 201) {
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
        Create Account
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={'text-primary-500'}>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    disabled={isLoading}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={'text-primary-500'}>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                    value={field.value ?? ''}
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
            {isLoading ? 'Loading...' : 'Create Account'}
          </Button>
        </form>
      </Form>

      <div className="max-w-md mx-auto">
        <p>
          Already have account ?{' '}
          <Link
            href={'/sign-in'}
            className="text-primary-500/80 drop-shadow-md hover:text-primary-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
