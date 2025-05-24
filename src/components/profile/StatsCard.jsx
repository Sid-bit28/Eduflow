import Image from 'next/image';
import React from 'react';

const StatsCard = ({ imgUrl, value, title }) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-light-200">
      <Image src={imgUrl} alt={title} height={50} width={40} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
