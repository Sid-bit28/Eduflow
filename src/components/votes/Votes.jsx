'use client';

import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const Votes = ({
  types,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}) => {
  const handleSave = () => {};

  const handlevote = action => {};
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
            onClick={() => {
              handlevote('downvote');
            }}
          />
          <div className="flex-center background-light700_dark400 min-[48px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      <Image
        src={hasSaved ? '/icons/star-filled.svg' : '/icons/star-red.svg'}
        width={18}
        height={18}
        alt="star"
        className="cursor-pointer"
        onClick={handleSave}
      />
    </div>
  );
};

export default Votes;
