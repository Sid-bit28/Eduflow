'use client';

import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { cn, formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

const LocalSearchbarContent = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');
  const [search, setSearch] = useState(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newURL = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        router.push(newURL, { scroll: false });
      } else {
        if (pathname === route) {
          const newURL = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q'],
          });
          router.push(newURL, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={cn(
        'bg-light-800 dark:bg-transparent flex min-h-[56px] grow items-center gap-4 rounded-xl px-2',
        otherClasses
      )}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={e => {
          setSearch(e.target.value);
        }}
        className={
          '!paragraph-regular !no-focus !placeholder !border-none !shadow-none !outline-none text-dark400_light700 bg-transparent'
        }
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search"
        />
      )}
    </div>
  );
};

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}) => {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'bg-light-800 dark:bg-transparent flex min-h-[56px] grow items-center gap-4 rounded-xl px-2',
            otherClasses
          )}
        >
          {iconPosition === 'left' && (
            <Skeleton className="h-6 w-6 rounded-full" />
          )}
          <Skeleton className="h-6 w-full rounded-md" />
          {iconPosition === 'right' && (
            <Skeleton className="h-6 w-6 rounded-full" />
          )}
        </div>
      }
    >
      <LocalSearchbarContent
        route={route}
        iconPosition={iconPosition}
        imgSrc={imgSrc}
        placeholder={placeholder}
        otherClasses={otherClasses}
      />
    </Suspense>
  );
};

export default LocalSearchbar;
