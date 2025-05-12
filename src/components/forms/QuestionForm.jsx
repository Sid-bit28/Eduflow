'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionsSchema } from '@/lib/Validations';

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  });

  function onSubmit(values) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className={'flex w-full flex-col'}>
              <FormLabel className={'paragraph-semibold text-dark400_light800'}>
                Question Title
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className={
                    'no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  }
                  placeholder="Type a Question..."
                  {...field}
                />
              </FormControl>
              <FormDescription className={'body-regular mt-2.5 text-light-500'}>
                Imagine asking a question to another developer and be as
                specific as you can.
              </FormDescription>
              <FormMessage className={'text-red-500'} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className={'flex w-full flex-col gap-3'}>
              <FormLabel className={'paragraph-semibold text-dark400_light800'}>
                Detailed explanation of your problem
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* TODO: Add editor with Markdown properties */}
              </FormControl>
              <FormDescription className={'body-regular mt-2.5 text-light-500'}>
                Introduce the problem and expand on what you put in the Question
                Title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className={'text-red-500'} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className={'flex w-full flex-col'}>
              <FormLabel className={'paragraph-semibold text-dark400_light800'}>
                Tags
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className={
                    'no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  }
                  placeholder="Add Tags..."
                  {...field}
                />
              </FormControl>
              <FormDescription className={'body-regular mt-2.5 text-light-500'}>
                Add upto 3 tags to describe what your question is about. You
                need to press Enter to add a tag.
              </FormDescription>
              <FormMessage className={'text-red-500'} />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
