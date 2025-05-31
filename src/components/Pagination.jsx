'use client';

import React, { Suspense } from 'react';
import { Button } from './ui/button';
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const PaginationContent = ({ pageNumber, isNext }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = direction => {
    const nextPageNumber =
      direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        className="light-border-2 border btn flex min-h-[36px] items-center gap-2"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="bg-primary-500 flex justify-center items-center rounded-md px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        className="light-border-2 border btn flex min-h-[36px] items-center gap-2"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

const Pagination = ({ pageNumber, isNext }) => {
  return (
    <Suspense
      fallback={
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            disabled
            className="light-border-2 border btn flex min-h-[36px] items-center gap-2"
          >
            <p className="body-medium text-dark200_light800">Loading...</p>
          </Button>
          <div className="bg-light-700 dark:bg-dark-400 flex justify-center items-center rounded-md px-3.5 py-2">
            <p className="body-semibold text-dark200_light800">...</p>
          </div>
          <Button
            disabled
            className="light-border-2 border btn flex min-h-[36px] items-center gap-2"
          >
            <p className="body-medium text-dark200_light800">Loading...</p>
          </Button>
        </div>
      }
    >
      <PaginationContent pageNumber={pageNumber} isNext={isNext} />
    </Suspense>
  );
};

export default Pagination;
