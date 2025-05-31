'use client';

import Image from 'next/image';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from '../GlobalResult';
import { Skeleton } from '../ui/skeleton';

const GlobalSearchContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);

  const query = searchParams.get('q');
  const [search, setSearch] = useState(query || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = event => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    setIsOpen(false);
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newURL = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        });

        router.push(newURL, { scroll: false });
      } else {
        if (query) {
          const newURL = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type'],
          });
          router.push(newURL, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, router, pathname, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="bg-light-800 dark:bg-transparent relative flex min-h-[56px] grow items-center gap-1 rounded-xl p-2">
        <Image
          src={'/icons/search.svg'}
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search"
        />
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '' && isOpen) {
              setIsOpen(false);
            }
          }}
          className={
            '!paragraph-regular no-focus !placeholder text-dark400_light700 border-none shadow-none outline-none bg-transparent'
          }
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

const GlobalSearch = () => {
  return (
    <Suspense
      fallback={
        <div className="relative w-full max-w-[600px] max-lg:hidden">
          <div className="bg-light-800 dark:bg-transparent relative flex min-h-[56px] grow items-center gap-1 rounded-xl p-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-full rounded-md" />
          </div>
        </div>
      }
    >
      <GlobalSearchContent />
    </Suspense>
  );
};

export default GlobalSearch;
