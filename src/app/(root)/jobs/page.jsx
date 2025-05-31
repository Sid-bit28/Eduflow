import NoResult from '@/components/NoResult';
import ROUTES from '@/constants/routes';
import React from 'react';

const Page = () => {
  return (
    <div>
      <section className="mt-10 flex w-full flex-col gap-6">
        <NoResult
          title="This page is under construction 🏗️🚧."
          description="This page will the job portal for the users to find jobs and apply for them."
          link={ROUTES.HOME}
          linkTitle="Go to Home"
        />
      </section>
    </div>
  );
};

export default Page;
