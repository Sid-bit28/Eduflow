import { getUserAnswers } from '@/app/actions/user.action';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';
import ErrorComponent from '../ErrorComponent';
import Pagination from '../Pagination';

const AnswerTab = async ({ searchParams, userId }) => {
  try {
    const { page } = await searchParams;
    const response = await getUserAnswers({
      userId: userId,
      page: page ? +page : 1,
    });
    if (!response.success) {
      throw new Error(response?.error || 'Internal Server Error');
    }
    const totalAnswers = response?.totalAnswers;
    const answers = response?.answers;

    return (
      <>
        {answers.map(answer => (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            question={answer.question}
            author={answer.author}
            upvotes={answer.upvotes.length}
            createdAt={answer.createdAt}
          />
        ))}
        <div className="mt-10">
          <Pagination pageNumber={page ? +page : 1} isNext={response?.isNext} />
        </div>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default AnswerTab;
