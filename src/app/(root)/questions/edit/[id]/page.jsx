import { getQuestionById } from '@/app/actions/question.action';
import { getLoggedInUserInfo } from '@/app/actions/user.action';
import ErrorComponent from '@/components/ErrorComponent';
import QuestionForm from '@/components/forms/QuestionForm';
import React from 'react';

export const metadata = {
  title: 'Edit Question | DevOverflow',
  description: 'Edit your question and get answers from the community.',
};

const Page = async ({ params }) => {
  try {
    const { id } = await params;

    const getQuestionByIdResponse = await getQuestionById({ questionId: id });
    if (!getQuestionByIdResponse.success) {
      throw new Error(
        getQuestionByIdResponse?.error || 'Internal Server Error'
      );
    }
    const question = getQuestionByIdResponse?.question;

    return (
      <>
        <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

        <div className="mt-9">
          <QuestionForm
            type="Edit"
            questionDetails={JSON.stringify(question)}
          />
        </div>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default Page;
