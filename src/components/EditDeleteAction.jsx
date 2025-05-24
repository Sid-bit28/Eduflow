'use client';

import { deleteAnswer } from '@/app/actions/answer.action';
import { deleteQuestion } from '@/app/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import ErrorComponent from './ErrorComponent';

const EditDeleteAction = ({ type, itemId }) => {
  try {
    const pathname = usePathname();
    const router = useRouter();

    const handleEdit = () => {
      router.push(`/questions/edit/${JSON.parse(itemId)}`);
    };
    const handleDelete = async () => {
      if (type === 'Question') {
        // Delete a Question
        const response = await deleteQuestion({
          questionId: JSON.parse(itemId),
          path: pathname,
        });
        if (!response?.success) {
          throw new Error(response?.error || 'Internal Server Error');
        }
        toast.success(response?.message);
      } else if (type === 'Answer') {
        // Delete a Answer
        const response = await deleteAnswer({
          answerId: JSON.parse(itemId),
          path: pathname,
        });
        if (!response?.success) {
          throw new Error(response?.error || 'Internal Server Error');
        }
        toast.success(response?.message);
      }
    };
    return (
      <div className="flex items-center justify-end gap-3 max-sm:w-full">
        {type === 'Question' && (
          <Image
            src={'/icons/edit.svg'}
            alt="edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
            onClick={handleEdit}
          />
        )}
        <Image
          src={'/icons/trash.svg'}
          alt="delete"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleDelete}
        />
      </div>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default EditDeleteAction;
