import { getQuestionByTagId } from '@/app/actions/tag.action';
import QuestionCard from '@/components/cards/QuestionCard';
import ErrorComponent from '@/components/ErrorComponent';
import NoResult from '@/components/NoResult';
import LocalSearchbar from '@/components/search/LocalSearchbar';
import ROUTES from '@/constants/routes';
import React from 'react';

const Page = async ({ params, searchParams }) => {
  try {
    const { id } = await params;
    const response = await getQuestionByTagId({
      tagId: id,
      page: 1,
      searchQuery: await searchParams.q,
    });
    if (!response?.success) {
      throw new Error(response?.error || 'Internal Server Error');
    }

    const tagTitle = response?.tagTitle;
    const questions = response?.questions;

    return (
      <>
        <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>

        <section className="mt-11 w-full">
          <LocalSearchbar
            route={ROUTES.TAG(id)}
            iconPosition="left"
            imgSrc="/icons/search.svg"
            placeholder="Search tag questions..."
            otherClasses="flex-1"
          />
        </section>

        <section className="mt-10 flex w-full flex-col gap-6">
          {questions.length > 0 ? (
            questions.map(question => (
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
            ))
          ) : (
            <NoResult
              title="There's no tag questions saved to show."
              description="Be the first to ask questions and activate the community. Ask a
        delightful as curious question regarding any techincal stuff you want to
        know and the community will help. Get involved and build the next great
        thing 🚀."
              link={ROUTES.ASK_QUESTION}
              linkTitle="Ask a Question"
            />
          )}
        </section>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default Page;
