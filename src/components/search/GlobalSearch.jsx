import Image from 'next/image';
import React from 'react';
import { Input } from '../ui/input';

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className=" relative flex min-h-[56px] grow items-center gap-1 rounded-xl p-2">
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
          value=""
          className={
            'paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none'
          }
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
