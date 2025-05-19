'use client';

import { downvoteAnswer, upvoteAnswer } from '@/app/actions/answer.action';
import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/app/actions/question.action';
import Axios from '@/lib/Axios';
import { formatNumber } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}) => {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleSave = () => {};

  const handleVote = async action => {
    if (!session) {
      return;
    }

    if (action === 'upvote') {
      if (type === 'Question') {
        const payLoad = {
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        };
        const response = await upvoteQuestion(payLoad);
        if (response?.success) {
          toast.success('Question upvoted.');
          router.refresh();
        }
      } else if (type === 'Answer') {
        const payLoad = {
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        };
        const response = await upvoteAnswer(payLoad);
        if (response?.success) {
          toast.success('Answer upvoted.');
          router.refresh();
        }
      }
    }

    if (action === 'downvote') {
      if (type === 'Question') {
        const payLoad = {
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        };
        const response = await downvoteQuestion(payLoad);
        if (response?.success) {
          toast.success('Question downvoted.');
          router.refresh();
        }
      } else if (type === 'Answer') {
        const payLoad = {
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        };
        const response = await downvoteAnswer(payLoad);
        if (response?.success) {
          toast.success('Answer downvoted.');
          router.refresh();
        }
      }
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={hasUpvoted ? '/icons/upvoted.svg' : '/icons/upvote.svg'}
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center background-light700_dark400 min-[48px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={hasDownvoted ? '/icons/downvoted.svg' : '/icons/downvote.svg'}
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center background-light700_dark400 min-[48px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === 'Question' && (
        <Image
          src={hasSaved ? '/icons/star-filled.svg' : '/icons/star-red.svg'}
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
