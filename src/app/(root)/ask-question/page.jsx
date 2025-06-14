import ErrorComponent from '@/components/ErrorComponent';
import QuestionForm from '@/components/forms/QuestionForm';
import React from 'react';

export const metadata = {
  title: 'Ask a Question | Eduflow',
  description: 'Ask a question and get answers from the community.',
};

const AskQuestion = () => {
  try {
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
        <div className="mt-9">
          <QuestionForm />
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default AskQuestion;
