import { getUserAnswers } from '@/app/actions/user.action';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';

const AnswerTab = async ({ searchParams, userId }) => {
  let totalAnswers = [];
  let answers = [];
  try {
    const response = await getUserAnswers({ userId: userId, page: 1 });
    if (response.success) {
      totalAnswers = response?.totalAnswers;
      answers = response?.answers;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || 'Internal Server Error');
  }
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
    </>
  );
};

export default AnswerTab;
