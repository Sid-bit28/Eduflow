'use client';

import React, { useRef, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { AnswerSchema } from '@/lib/Validations';
import Editor from '../editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { createAnswer } from '@/app/actions/answer.action';

const AnswerForm = ({ question, questionId }) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: '',
    },
  });

  const handleCreateAnswer = async values => {
    setIsSubmitting(true);
    try {
      const payLoad = {
        content: values.answer,
        question: JSON.parse(questionId),
        path: pathname,
      };
      const response = await createAnswer(payLoad);
      console.log('Response', response);
      if (response?.success) {
        toast.success(response?.message);
        form.reset();
        editorRef.current.setContent('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.error || 'Failed to Create Answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 mt-5">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here..
        </h4>
        <Button
          className={
            'btn light-border-2 gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-dark200_light900 transition-all duration-200 ease-in-out hover:bg-light100 focus:outline-none focus:ring-2 focus:ring-light100 focus:ring-offset-2 dark:border-dark300_light700 dark:bg-dark100 dark:text-dark300_light700 dark:hover:bg-dark200 dark:focus:ring-offset-0 sm:mt-0 cursor-pointer'
          }
          onClick={() => {}}
        >
          <Image
            src="/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
          Generate an AI Answer
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className={'flex w-full flex-col gap-3'}>
                <FormControl className="mt-3.5">
                  <Editor
                    value={field.value}
                    ref={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className={'text-red-500'} />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className={'primary-gradient w-fit text-white cursor-pointer'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
