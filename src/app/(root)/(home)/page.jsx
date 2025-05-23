import { getQuestions } from '@/app/actions/question.action';
import QuestionCard from '@/components/cards/QuestionCard';
import CommonFilter from '@/components/filters/CommonFilter';
import HomeFilter from '@/components/filters/HomeFilter';
import NoResult from '@/components/NoResult';
import LocalSearchbar from '@/components/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import Link from 'next/link';
import React from 'react';

const Page = async () => {
  let questionsData = [];
  try {
    const response = await getQuestions({});
    if (response?.success) {
      questionsData = response?.questions || [];
    }
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || 'Internal Server Error');
  }

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link
          href={ROUTES.ASK_QUESTION}
          className="flex justify-end max-sm:w-full"
        >
          <Button
            className={
              'primary-gradient min-h-[46px] px-4 py-3 !text-light-900'
            }
          >
            Ask a Question
          </Button>
        </Link>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.HOME}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] w-full"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter filters={HomePageFilters} />

      <section className="mt-10 flex w-full flex-col gap-6">
        {questionsData.length > 0 ? (
          questionsData.map(question => (
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
            title="There's no questions to show."
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
