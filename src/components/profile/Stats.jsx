import { formatNumber } from '@/lib/utils';
import React from 'react';
import StatsCard from './StatsCard';

const Stats = ({ totalQuestions, totalAnswers }) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>

      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-col-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-light-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={0}
          title="Gold Badges"
        />
        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={0}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={0}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
