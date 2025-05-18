import AllAnswers from '@/components/answer/AllAnswers';
import DataRenderer from '@/components/DataRenderer';
import AnswerForm from '@/components/forms/AnswerForm';
import Metric from '@/components/Metric';
import MarkdownRenderer from '@/components/questions/MarkdownRenderer';
import Votes from '@/components/votes/Votes';
import Axios from '@/lib/Axios';
import { formatNumber, getTimeStamp } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const QuestionPage = async ({ params }) => {
  const { id } = await params;
  let questionData = null;

  try {
    const response = await Axios.get(`/api/question/${id}`);
    if (response.status === 200) {
      questionData = response?.data?.question;
    }
  } catch (error) {
    throw new Error('Question not found');
  }
  console.log(questionData);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${questionData?.author?._id}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={questionData?.author?.picture || '/icons/avatar.svg'}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {questionData?.author?.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(questionData?._id)}
              userId={JSON.stringify(questionData?.author?._id)}
              upvotes={questionData?.upvotes?.length}
              hasUpvoted={questionData?.upvotes?.includes(
                questionData?.author?._id
              )}
              downvotes={questionData?.downvotes?.length}
              hasDownvoted={questionData?.downvotes?.includes(
                questionData?.author?._id
              )}
              hasSaved={questionData?.saved?.includes(questionData?._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {questionData?.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="Clock Icon"
          value={` asked ${getTimeStamp(questionData?.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message"
          value={formatNumber(questionData?.answers?.length || 0)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye"
          value={formatNumber(Number.parseInt(questionData?.views || 0))}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <MarkdownRenderer>
        {questionData?.content?.replace(/(\[.*?\])/g, '$1\n')}
      </MarkdownRenderer>

      <div className="mt-8 flex flex-wrap gap-2">
        {questionData?.tags?.map(tag => (
          <DataRenderer
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={id}
        totalAnswers={questionData?.answers?.length}
      />

      <AnswerForm
        question={questionData?.content}
        questionId={questionData?._id}
      />
    </>
  );
};

export default QuestionPage;
