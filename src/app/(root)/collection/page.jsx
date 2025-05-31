import { getSavedQuestions } from '@/app/actions/user.action';
import QuestionCard from '@/components/cards/QuestionCard';
import ErrorComponent from '@/components/ErrorComponent';
import CommonFilter from '@/components/filters/CommonFilter';
import NoResult from '@/components/NoResult';
import Pagination from '@/components/Pagination';
import LocalSearchbar from '@/components/search/LocalSearchbar';
import { CollectionFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import React from 'react';

export const metadata = {
  title: 'Saved Questions | DevOverflow',
  description:
    'A community-driven platform for asking and answering questions.',
};

const Page = async ({ searchParams }) => {
  try {
    const { q, filter, page } = await searchParams;
    const response = await getSavedQuestions({
      page: page ? +page : 1,
      searchQuery: q,
      filter: filter,
    });
    if (!response?.success) {
      throw new Error(response?.error || 'Internal Server Error');
    }
    const savedQuestionsData = response?.savedQuestions;

    return (
      <>
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

        <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearchbar
            route={ROUTES.COLLECTION}
            iconPosition="left"
            imgSrc="/icons/search.svg"
            placeholder="Search for questions..."
            otherClasses="flex-1"
          />

          <CommonFilter
            filters={CollectionFilters}
            otherClasses="min-h-[56px] w-full"
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
        <div className="mt-10">
          <Pagination pageNumber={page ? +page : 1} isNext={response?.isNext} />
        </div>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default Page;
