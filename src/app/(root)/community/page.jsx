import { getAllUsers } from '@/app/actions/user.action';
import UserCard from '@/components/cards/UserCard';
import ErrorComponent from '@/components/ErrorComponent';
import CommonFilter from '@/components/filters/CommonFilter';
import Pagination from '@/components/Pagination';
import LocalSearchbar from '@/components/search/LocalSearchbar';
import { UserFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Community | Eduflow',
  description:
    'A community-driven platform for asking and answering questions.',
};

const Page = async ({ searchParams }) => {
  try {
    const { q, filter, page } = await searchParams;
    const response = await getAllUsers({
      searchQuery: q,
      filter: filter,
      page: page ? +page : 1,
    });
    if (!response?.success) {
      throw new Error(response?.error || 'Internal Server Error');
    }
    const usersData = response?.users;

    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
        <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearchbar
            route={ROUTES.COMMUNITY}
            iconPosition="left"
            imgSrc="/icons/search.svg"
            placeholder="Search for amazing people..."
            otherClasses="flex-1"
          />

          <CommonFilter
            filters={UserFilters}
            otherClasses="min-h-[56px] w-full"
          />
        </section>
        <section className="mt-12 flex flex-wrap gap-4">
          {usersData.length > 0 ? (
            usersData.map(user => <UserCard key={user._id} user={user} />)
          ) : (
            <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
              <p>No Users Yet.</p>
              <Link
                href={ROUTES.SIGN_UP}
                className="mt-2 font-bold text-primary-500 underline decoration-primary-500 underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary-600 hover:decoration-primary-600"
              >
                Join to be the first!
              </Link>
            </div>
          )}
        </section>

        <div className="mt-10">
          <Pagination pageNumber={page ? +page : 1} isNext={response?.isNext} />
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default Page;
