import { getSavedQuestions } from '@/app/actions/user.action';
import QuestionCard from '@/components/cards/QuestionCard';
import CommonFilter from '@/components/filters/CommonFilter';
import NoResult from '@/components/NoResult';
import LocalSearchbar from '@/components/search/LocalSearchbar';
import { CollectionFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import React from 'react';

const Page = async () => {
  let savedQuestionsData = [];
  try {
    const response = await getSavedQuestions({});
    if (response?.success) {
      savedQuestionsData = response?.savedQuestions || [];
    }
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || 'Internal Server Error');
  }
  console.log(savedQuestionsData);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.HOME}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] w-full"
          containerClasses="hidden max-md:flex"
        />
      </section>

      <section className="mt-10 flex w-full flex-col gap-6">
        {savedQuestionsData.length > 0 ? (
          savedQuestionsData.map(question => (
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
            title="There's no saved questions to show."
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
};

export default Page;
