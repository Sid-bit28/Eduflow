import Image from 'next/image';
import Link from 'next/link';
import DataRenderer from '../DataRenderer';

const hotQuestions = [
  { _id: 1, title: 'How do I use express as a custom server in NextJS.' },
  { _id: 2, title: 'How do I use express as a custom server in NextJS.' },
  { _id: 3, title: 'How do I use express as a custom server in NextJS.' },
  { _id: 4, title: 'How do I use express as a custom server in NextJS.' },
  { _id: 5, title: 'How do I use express as a custom server in NextJS.' },
];

const popularTags = [
  {
    _id: 1,
    title: 'Javascript',
    totalQuestions: 5,
  },
  {
    _id: 2,
    title: 'React',
    totalQuestions: 5,
  },
  {
    _id: 3,
    title: 'Next.js',
    totalQuestions: 5,
  },
  {
    _id: 4,
    title: 'Vue.js',
    totalQuestions: 2,
  },
  {
    _id: 5,
    title: 'Redux',
    totalQuestions: 10,
  },
];
const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 h-screen flex w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Question</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(question => (
            <Link
              href={'/question/${question._id}'}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="icons/chevron-right.svg"
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
              name={tag.title}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
