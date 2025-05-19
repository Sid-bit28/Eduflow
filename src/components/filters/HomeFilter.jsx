'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const HomeFilter = ({ filters }) => {
  const [active, setActive] = useState('');
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
          onClick={() => {}}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
