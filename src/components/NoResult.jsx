import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

const NoResult = ({ title, description, link, linkTitle }) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={'/images/light-illustration.png'}
        alt="No Result Illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src={'/images/dark-illustration.png'}
        alt="No Result Illustration"
        width={270}
        height={200}
        className="object-contain hidden dark:flex"
      />

      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button
          className={
            'paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900'
          }
        >
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
