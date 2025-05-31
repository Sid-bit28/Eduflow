'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './filters/GlobalFilters';
import { globalSearch } from '@/app/actions/general.action';
import ROUTES from '@/constants/routes';

const GlobalResultContent = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  const global = searchParams.get('global');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        const response = await globalSearch({ query: global, type });
        setResult(response?.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type, id) => {
    switch (type) {
      case 'question':
        return ROUTES.QUESTION(id);
      case 'answer':
        return ROUTES.QUESTION(id);
      case 'user':
        return ROUTES.PROFILE(id);
      case 'tag':
        return ROUTES.TAG(id);
      default:
        return '/';
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400 rounded-xl">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-light-500/50" />

      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isLoading ? (
          <div className="flex flex-col px-5 justify-center items-center">
            <LoadingSpinner />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item, index) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={`${item.type}-${item.id}-${index}`}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:background-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src={'/icons/tag.svg'}
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  {global
                    ? 'Oops, no results found.'
                    : 'Search for something...'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GlobalResult = () => {
  return (
    <Suspense
      fallback={
        <div className="absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400 rounded-xl">
          <GlobalFilters />
          <div className="my-5 h-[1px] bg-light-700/50 dark:bg-light-500/50" />
          <div className="flex flex-col px-5 justify-center items-center py-10">
            <LoadingSpinner />
            <p className="text-dark200_light800 body-regular mt-2">
              Loading search parameters...
            </p>
          </div>
        </div>
      }
    >
      <GlobalResultContent />
    </Suspense>
  );
};

export default GlobalResult;
