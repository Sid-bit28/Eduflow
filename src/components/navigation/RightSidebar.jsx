import Image from 'next/image';
import Link from 'next/link';
import DataRenderer from '../DataRenderer';
import ErrorComponent from '../ErrorComponent';
import { getHotQuestions } from '@/app/actions/question.action';
import { getPopularTags } from '@/app/actions/tag.action';

const RightSidebar = async () => {
  try {
    const getHotQuestionsResponse = await getHotQuestions();
    if (!getHotQuestionsResponse?.success) {
      throw new Error(
        getHotQuestionsResponse?.error || 'Internal Server Error'
      );
    }
    const hotQuestions = getHotQuestionsResponse?.hotQuestions;

    const getPopularTagsResponse = await getPopularTags();
    if (!getPopularTagsResponse?.success) {
      throw new Error(getPopularTagsResponse?.error || 'Internal Server Error');
    }
    const popularTags = getPopularTagsResponse?.popularTags;

    return (
      <section className="background-light900_dark200 light-border sticky right-0 top-0 h-screen flex w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
        <div>
          <h3 className="h3-bold text-dark200_light900">Top Question</h3>
          <div className="mt-7 flex w-full flex-col gap-[30px]">
            {hotQuestions.map(question => (
              <Link
                href={`/questions/${question._id}`}
                key={question._id}
                className="flex cursor-pointer items-center justify-between gap7"
              >
                <p className="body-medium text-dark500_light700">
                  {question.title}
                </p>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
          <div className="mt-7 flex flex-col gap-4">
            {popularTags.map(tag => (
              <DataRenderer
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                totalQuestions={tag.numberOfQuestions}
                showCount
              />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default RightSidebar;
