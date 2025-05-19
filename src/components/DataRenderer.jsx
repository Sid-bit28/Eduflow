import Link from 'next/link';
import React from 'react';
import { Badge } from '@/components/ui/badge';

const DataRenderer = ({ _id, name, totalQuestions, showCount }) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge
        className={
          'subtle-medium background-light800_dark300 text-light400_dark500 rounded-md border-none px-4 py-2 uppercase text-dark200_light900 transition-all duration-200 ease-in-out hover:bg-light100 focus:outline-none focus:ring-2 focus:ring-light100 focus:ring-offset-2 dark:border-dark300_light700 dark:bg-dark100 dark:text-dark300_light700 dark:hover:bg-dark200 dark:focus:ring-offset-0 sm:mt-0 cursor-pointer'
        }
      >
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default DataRenderer;
