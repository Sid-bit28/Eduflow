'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { cn, formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const HomeFilter = ({ filters }) => {
  const searchParams = useSearchParams();
  const [active, setActive] = useState('');
  const router = useRouter();

  const handleTypeClick = item => {
    console.log(item);
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
          key={filter.name}
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

export default HomeFilter;
