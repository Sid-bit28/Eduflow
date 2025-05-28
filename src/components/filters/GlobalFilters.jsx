'use client';

import { GlobalSearchFilters } from '@/constants/filters';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get('type');

  const [active, setActive] = useState(typeParams || '');

  const handleTypeClick = type => {
    if (active === type) {
      setActive('');

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(type);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: type.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map(globalSearchFilter => (
          <Button
            key={globalSearchFilter.value}
            type="button"
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:hover:text-primary-500 text-light-900 ${active === globalSearchFilter.value ? 'bg-primary-500 text-light-900' : 'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'}`}
            onClick={() => handleTypeClick(globalSearchFilter.value)}
          >
            {globalSearchFilter.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
