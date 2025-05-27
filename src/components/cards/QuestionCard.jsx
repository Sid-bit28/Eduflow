import ROUTES from '@/constants/routes';
import Link from 'next/link';
import React from 'react';
import DataRenderer from '../DataRenderer';
import Metric from '../Metric';
import { formatNumber, getTimeStamp } from '@/lib/utils';
import { getLoggedInUserInfo, getUserInfo } from '@/app/actions/user.action';
import EditDeleteAction from '../EditDeleteAction';
import ErrorComponent from '../ErrorComponent';

const QuestionCard = async ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}) => {
  try {
    const response = await getLoggedInUserInfo();
    if (!response?.success) {
      throw new Error(response?.error || 'Internal Server Error');
    }
    const userId = response?.userId;

    let showActionButtons = userId && userId === author._id;
    return (
      <div className="card-wrapper p-9 sm:px-11 rounded-[10px] mt-5">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimeStamp(createdAt)}
            </span>
            <Link href={ROUTES.QUESTION(_id)}>
              <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                {title}
              </h3>
            </Link>
          </div>

          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map(tag => (
            <DataRenderer key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.picture || '/icons/avatar.svg'}
            alt="user"
            value={author.name}
            title={` - asked ${getTimeStamp(createdAt)}`}
            href={ROUTES.PROFILE(_id)}
            isAuthor
            textStyles="body-medium text-dark400_light700"
          />
          <Metric
            imgUrl="/icons/like.svg"
            alt="upvotes"
            value={formatNumber(upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="message"
            value={formatNumber(answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="eye"
            value={formatNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default QuestionCard;
