'use client';

import { downvoteAnswer, upvoteAnswer } from '@/app/actions/answer.action';
import { viewQuestion } from '@/app/actions/interaction.action';
import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/app/actions/question.action';
import { toggleSaveQuestion } from '@/app/actions/user.action';
import Axios from '@/lib/Axios';
import { formatNumber } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
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

  const handleSave = async () => {
    try {
      const payLoad = {
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathname,
      };
      const response = await toggleSaveQuestion(payLoad);
      if (response?.success) {
        toast.success(response?.message);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.error || 'Internal Server Error');
    }
  };

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
          toast.success(response?.message);
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
          toast.success(response?.message);
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
          toast.success(response?.message);
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
          toast.success(response?.message);
          router.refresh();
        }
      }
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

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
