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
import ROUTES from '@/constants/routes';
import { usePathname, useRouter } from 'next/navigation';
import { createQuestion } from '@/app/actions/question.action';
import ErrorComponent from '../ErrorComponent';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

const type = 'create';

const QuestionForm = () => {
  try {
    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
      resolver: zodResolver(QuestionsSchema),
      defaultValues: {
        title: '',
        content: '',
        tags: [],
      },
    });

    const handleFormSubmit = async values => {
      setIsLoading(true);
      const payLoad = {
        title: values.title,
        content: values.content,
        tags: values.tags,
        path: pathname,
      };
      const response = await createQuestion(payLoad);
      if (!response?.success) {
        toast.error(response?.error || 'Internal Server Error');
      }
      toast.success(response?.message);
      form.reset();
      editorRef.current.setContent('');
      router.push(ROUTES.HOME);
      setIsLoading(false);
    };

    const handleInputKeyDown = (e, field) => {
      if (e.key === 'Enter' && field.name === 'tags') {
        e.preventDefault();

        const tagInput = e.target;
        const tagValue = tagInput.value.trim();

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
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex w-full flex-col gap-10"
        >
          {/* Title FormField */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className={'flex w-full flex-col'}>
                <FormLabel
                  className={'paragraph-semibold text-dark400_light800'}
                >
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
                <FormDescription
                  className={'body-regular mt-2.5 text-light-500'}
                >
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
            name="content"
            render={({ field }) => (
              <FormItem className={'flex w-full flex-col gap-3'}>
                <FormLabel
                  className={'paragraph-semibold text-dark400_light800'}
                >
                  Detailed explanation of your problem
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    value={field.value}
                    ref={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormDescription
                  className={'body-regular mt-2.5 text-light-500'}
                >
                  Introduce the problem and expand on what you put in the
                  Question Title. Minimum 20 characters.
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
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <div>
                    <Input
                      disabled={type === 'Edit'}
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      placeholder="Add tags..."
                      onKeyDown={e => handleInputKeyDown(e, field)}
                    />

                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map(tag => (
                          <Badge
                            key={tag}
                            className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                            onClick={() =>
                              type !== 'Edit'
                                ? handleTagRemove(tag, field)
                                : () => {}
                            }
                          >
                            {tag}
                            {type !== 'Edit' && (
                              <Image
                                src="/icons/close.svg"
                                alt="Close icon"
                                width={12}
                                height={12}
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Add up to 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={'primary-gradient w-fit !text-light-900 cursor-pointer'}
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
  } catch (error) {
    return <ErrorComponent error={error} />;
    s;
  }
};

export default QuestionForm;
