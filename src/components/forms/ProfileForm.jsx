'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useForm } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { ProfileSchema } from '@/lib/Validations';
import ErrorComponent from '../ErrorComponent';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/app/actions/user.action';

const ProfileForm = ({ userId, user }) => {
  try {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const parsedUser = JSON.parse(user);

    const form = useForm({
      resolver: zodResolver(ProfileSchema),
      defaultValues: {
        name: parsedUser.name || '',
        portfolioWebsite: parsedUser.portfolioWebsite || '',
        location: parsedUser.location || '',
        bio: parsedUser.bio || '',
      },
    });

    async function onSubmit(values) {
      setIsSubmitting(true);
      const payLoad = {
        userId: userId,
        updateData: {
          name: values.name,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      };
      await updateUser(payLoad);
      setIsSubmitting(false);
      router.back();
    }
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full gap-9 flex-col"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className={'space-y-3.5'}>
                <FormLabel>
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Name..."
                    {...field}
                    className={
                      'no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className={'space-y-3.5'}>
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Your Portfolio URL.."
                    {...field}
                    className={
                      'no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className={'space-y-3.5'}>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where are you from.."
                    {...field}
                    className={
                      'no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className={'space-y-3.5'}>
                <FormLabel>
                  Bio <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's special about you?"
                    {...field}
                    className={
                      'no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border'
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              className={'primary-gradient w-fit'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default ProfileForm;
