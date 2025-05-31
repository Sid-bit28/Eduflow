'use client';

import { cn, formUrlQuery } from '@/lib/utils';
import React, { Suspense } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

const CommonFilterContent = ({ filters, otherClasses, containerClasses }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramsFilter = searchParams.get('filter');

  const handleUpdateParams = value => {
    const newURL = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value,
    });
    router.push(newURL, { scroll: false });
  };

  return (
    <div className={cn('relative', containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            'body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5',
            otherClasses
          )}
          aria-label="Filter options"
        >
          <div className="line-clamp-1 flex-1 text-left paragraph-regular text-slate-600">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map(item => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="line-clamp-1 flex-1 text-left paragraph-regular text-slate-600"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const CommonFilter = ({ filters, otherClasses, containerClasses }) => {
  return (
    <Suspense
      fallback={
        <div className={cn('relative', containerClasses)}>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      }
    >
      <CommonFilterContent
        filters={filters}
        otherClasses={otherClasses}
        containerClasses={containerClasses}
      />
    </Suspense>
  );
};

export default CommonFilter;
