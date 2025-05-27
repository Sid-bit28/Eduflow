import React from 'react';
import CommonFilter from '../filters/CommonFilter';
import { AnswerFilters } from '@/constants/filters';
import Link from 'next/link';
import Image from 'next/image';
import { getTimeStamp } from '@/lib/utils';
import MarkdownRenderer from '../questions/MarkdownRenderer';
import { getAnswers } from '@/app/actions/answer.action';
import Votes from '../votes/Votes';
import ErrorComponent from '../ErrorComponent';
import Pagination from '../Pagination';

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  filter,
  page,
}) => {
  try {
    const response = await getAnswers({
      questionId: JSON.parse(questionId),
      filter,
      page: page ? +page : 1,
    });
    if (!response?.success) {
      throw new Error(response?.error || 'Failed to fetch answers');
    }
    const answersData = response?.answers || [];

    return (
      <div className="mt-11">
        <div className="flex items-center justify-between">
          <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
          <CommonFilter filters={AnswerFilters} />
        </div>

        <div className="">
          {answersData?.map(answer => (
            <article key={answer?._id} className="light-border border-b py-10">
              <div className="flex items-center justify-between">
                <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                  <Link
                    href={`/profile/${answer?.author?._id}`}
                    className="flex flex-1 items-start gap-1 sm:items-center"
                  >
                    <Image
                      src={answer?.author?.picture || '/icons/avatar.svg'}
                      width={18}
                      height={18}
                      alt="profile"
                      className="rounded-full object-cover max-sm:mt-0.5"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <p className="body-semibold text-dark300_light700">
                        {answer?.author?.name}
                      </p>
                      <p className="small-regular text-light400_dark500 line-clamp-1">
                        {' '}
                        {getTimeStamp(answer?.createdAt)}
                      </p>
                    </div>
                  </Link>
                  <div className="flex justify-end">
                    <Votes
                      type="Answer"
                      itemId={JSON.stringify(answer?._id)}
                      userId={userId}
                      upvotes={answer?.upvotes?.length}
                      hasUpvoted={answer?.upvotes?.includes(JSON.parse(userId))}
                      downvotes={answer?.downvotes?.length}
                      hasDownvoted={answer?.downvotes?.includes(
                        JSON.parse(userId)
                      )}
                    />
                  </div>
                </div>
              </div>

              <MarkdownRenderer>
                {answer?.content?.replace(/(\[.*?\])/g, '$1\n')}
              </MarkdownRenderer>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Pagination pageNumber={page ? +page : 1} isNext={response?.isNext} />
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default AllAnswers;
