import { getUserQuestions } from '@/app/actions/user.action';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';
import ErrorComponent from '../ErrorComponent';
import Pagination from '../Pagination';

const QuestionTab = async ({ searchParams, userId }) => {
  try {
    const { page } = await searchParams;
    const response = await getUserQuestions({
      userId,
      page: page ? +page : 1,
    });
    if (!response?.success) {
      throw new Error(response?.error || 'Internal Server Error');
    }
    const questions = response?.questions;
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
        <div className="mt-10">
          <Pagination pageNumber={page ? +page : 1} isNext={response?.isNext} />
        </div>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default QuestionTab;
