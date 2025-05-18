import CommonFilter from '@/components/filters/CommonFilter';
import LocalSearchbar from '@/components/search/LocalSearchbar';
import { TagFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import Axios from '@/lib/Axios';
import React from 'react';
import TagCard from '@/components/cards/TagCard';
import NoResult from '@/components/NoResult';

const Page = async () => {
  const response = await Axios.get('/api/tags');
  const tags = response?.data?.tags || [];
  console.log(tags);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={ROUTES.TAGS}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="Search for Tags..."
          otherClasses="flex-1"
        />

        <CommonFilter filters={TagFilters} otherClasses="min-h-[56px] w-full" />
      </section>
      <section className="mt-12 flex flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map(tag => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found"
            link={ROUTES.ASK_QUESTION}
            linkTitle="Ask a Question"
          />
        )}
      </section>
    </div>
  );
};

export default Page;
