import { formatNumber, getTimeStamp } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import Metric from '../Metric';
import { getLoggedInUserInfo } from '@/app/actions/user.action';
import EditDeleteAction from '../EditDeleteAction';

const AnswerCard = async ({ _id, question, author, upvotes, createdAt }) => {
  let userId = null;
  try {
    const response = await getLoggedInUserInfo();
    if (response.success) {
      userId = response.userId;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || 'Internal Server Error');
  }

  let showActionButtons = userId && userId === author._id;
  return (
    <div>
      <div className="card-wrapper rounded-[10px] px-11 py-9">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimeStamp(createdAt)}
            </span>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              <Link href={`/question/${question._id}/${_id}`}>
                {question.title}
              </Link>
            </h3>
          </div>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.picture || '/icons/avatar.svg'}
            alt="user avatar"
            value={author.name}
            title={` ● asked ${getTimeStamp(createdAt)}`}
            href={`/profile/${author._id}`}
            textStyles="body-medium text-dark400_light700"
            isAuthor
          />
          <div className="flex-center gap-3">
            <Metric
              imgUrl={'/icons/like.svg'}
              alt="like icon"
              value={formatNumber(upvotes)}
              title={` Votes`}
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
