'use client';

import Image from 'next/image';
import React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}) => {
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
        value=""
        onChange={() => {}}
        className={
          '!paragraph-regular !no-focus !placeholder !border-none !shadow-none !outline-none'
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

export default LocalSearchbar;
