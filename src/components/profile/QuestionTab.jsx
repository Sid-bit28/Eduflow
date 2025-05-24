import { getQuestionById } from '@/app/actions/question.action';
import { getUserQuestions } from '@/app/actions/user.action';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';

const QuestionTab = async ({ searchParams, userId }) => {
  let totalQuestions = [];
  let questions = [];
  try {
    const response = await getUserQuestions({
      userId,
      page: 1,
    });
    if (response.success) {
      totalQuestions = response?.totalQuestions;
      questions = response?.questions;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || 'Internal Server Error');
  }
  return (
    <>
      {questions.map(question => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </>
  );
};

export default QuestionTab;
