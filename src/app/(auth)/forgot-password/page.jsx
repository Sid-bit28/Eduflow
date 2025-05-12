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
import { toast } from 'sonner';
import Axios from '@/lib/Axios';
import { ForgotPasswordSchema } from '@/lib/Validations';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function onFormSubmit(values) {
    const payload = {
      email: values.email,
    };

    try {
      setIsLoading(true);
      const response = await Axios.post('/api/auth/forgot-password', payload);
      if (response.status === 200) {
        toast.success(response.data.message);
        form.reset();
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
        Forgot Password
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
          <Button
            disabled={isLoading}
            className="w-full cursor-pointer bg-primary-100/80 hover:bg-primary-100"
            type="submit"
          >
            {isLoading ? 'Loading..' : 'Submit'}
          </Button>
        </form>
      </Form>
      <div className="max-w-md mx-auto">
        <p>
          Already have account?{' '}
          <Link href="/sign-in" className="text-primary-500 drop-shadow-md">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
