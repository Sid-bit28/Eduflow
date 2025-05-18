'use client';

import DataRenderer from '@/components/DataRenderer';
import AnswerForm from '@/components/forms/AnswerForm';
import Metric from '@/components/Metric';
import MarkdownRenderer from '@/components/questions/MarkdownRenderer';
import Axios from '@/lib/Axios';
import { formatNumber, getTimeStamp } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const QuestionPage = () => {
  const { id } = useParams();
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await Axios.get(`/api/question/${id}`);
        if (response.status === 200) {
          setData(response?.data?.question);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast.error(
          error?.response?.data?.error || 'Failed to fetch question.'
        );
      }
    };

    fetchQuestion();
  }, [id]);

  console.log('Data', data);
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${data?.author?._id}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={data?.author?.picture || '/icons/avatar.svg'}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {data?.author?.name}
            </p>
          </Link>
          <div className="flex justify-end">Voting</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {data?.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="Clock Icon"
          value={` asked ${getTimeStamp(data?.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message"
          value={formatNumber(data?.answers?.length || 0)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye"
          value={formatNumber(Number.parseInt(data?.views || 0))}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <MarkdownRenderer>
        {data?.content?.replace(/(\[.*?\])/g, '$1\n')}
      </MarkdownRenderer>

      <div className="mt-8 flex flex-wrap gap-2">
        {data?.tags?.map(tag => (
          <DataRenderer
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AnswerForm />
    </>
  );
};

export default QuestionPage;
