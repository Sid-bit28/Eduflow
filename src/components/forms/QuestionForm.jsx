'use client';

import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

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
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { toast } from 'sonner';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

const type = 'create';

const QuestionForm = () => {
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  });

  function onSubmit(values) {
    setIsLoading(true);
    try {
      // make an async call to our API -> create a question which will contain all form data
      // navigate to home page
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
    console.log(values);
  }

  const handleInputKeyDown = (e, field) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target;
      const tagValue = tagInput.value.trim();
      console.log(tagValue);

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'Required',
            message: 'Tag must be less than 15 characters.',
          });
        }

        if (!field.value.includes(tagValue)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = '';
          form.clearErrors('tags');
        } else {
          form.trigger();
        }
      }
    }
  };

  const handleTagRemove = (tag, field) => {
    const newTags = field.value.filter(t => t !== tag);
    form.setValue('tags', newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        {/* Title FormField */}
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

        {/* Editor FormField */}
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
                <Editor
                  value={field.value}
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className={'body-regular mt-2.5 text-light-500'}>
                Introduce the problem and expand on what you put in the Question
                Title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className={'text-red-500'} />
            </FormItem>
          )}
        />

        {/* Tags FormField */}
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
                <div>
                  <Input
                    className={
                      'no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    }
                    placeholder="Add Tags..."
                    onKeyDown={e => handleInputKeyDown(e, field)}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map(tag => (
                        <Badge
                          key={tag}
                          className={
                            'subtle-large background-light800_dark300 text-light400_dark500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'
                          }
                          onClick={() => handleTagRemove(tag, field)}
                        >
                          {tag}
                          <Image
                            src={'/icons/close.svg'}
                            alt="Close Icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className={'body-regular mt-2.5 text-light-500'}>
                Add upto 3 tags to describe what your question is about. You
                need to press Enter to add a tag.
              </FormDescription>
              <FormMessage className={'text-red-500'} />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={'primary-gradient w-fit !text-light-900'}
          disabled={isLoading}
        >
          {isLoading ? (
            <>{type === 'edit' ? 'Editing...' : 'Posting...'}</>
          ) : (
            <>{type === 'edit' ? 'Edit Question' : 'Ask a Question'}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
