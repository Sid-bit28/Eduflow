'use client';

import React, { Suspense, useState } from 'react';
import { Button } from '../ui/button';
import { cn, formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

const HomeFilterContent = ({ filters }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState('');

  const handleTypeClick = item => {
    if (active === item) {
      setActive('');
      const newURL = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });
      router.push(newURL, { scroll: false });
    } else {
      setActive(item);
      const newURL = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase(),
      });
      router.push(newURL, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map(filter => (
        <Button
          key={filter.value}
          className={cn(
            `body-medium rounded-lg px-6 py-3 capitalize shadow-none cursor-pointer`,
            active === filter.value
              ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
              : 'bg-light-800 text-light-500 hover:bg-primary-500/70 hover:text-white dark:bg-dark-300 dark:text-light-500 dark:hover:bg-primary-500/70 dark:hover:text-white'
          )}
          onClick={() => handleTypeClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

const HomeFilter = ({ filters }) => {
  return (
    <Suspense
      fallback={
        <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
          {filters.map(filter => (
            <Skeleton key={filter.value} className="h-11 w-24 rounded-lg" />
          ))}
        </div>
      }
    >
      <HomeFilterContent filters={filters} />
    </Suspense>
  );
};

export default HomeFilter;
