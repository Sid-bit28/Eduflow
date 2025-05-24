'use client';

import { deleteAnswer } from '@/app/actions/answer.action';
import { deleteQuestion } from '@/app/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const EditDeleteAction = ({ type, itemId }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === 'Question') {
      // Delete a Question
      try {
        const response = await deleteQuestion({
          questionId: JSON.parse(itemId),
          path: pathname,
        });
        console.log(response);
        if (response.success) {
          toast.success(response?.message);
        }
      } catch (error) {
        console.log(error);
        throw new Error(error?.error || 'Internal Server Error');
      }
    } else if (type === 'Answer') {
      // Delete a Answer
      try {
        const response = await deleteAnswer({
          answerId: JSON.parse(itemId),
          path: pathname,
        });
        if (response.success) {
          toast.success(response?.message);
        }
      } catch (error) {
        console.log(error);
        throw new Error(error?.error || 'Internal Server Error');
      }
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
};

export default EditDeleteAction;
