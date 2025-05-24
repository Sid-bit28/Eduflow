import { getLoggedInUserInfo, getUserInfo } from '@/app/actions/user.action';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJoinedDate } from '@/lib/utils';
import ProfileLink from '@/components/profile/ProfileLink';
import Stats from '@/components/profile/Stats';
import QuestionTab from '@/components/profile/QuestionTab';
import AnswerTab from '@/components/profile/AnswerTab';
import ErrorComponent from '@/components/ErrorComponent';

const Page = async ({ params, searchParams }) => {
  try {
    const userId = await params.id;
    const getUserInfoResponse = await getUserInfo({ userId: userId });
    if (!getUserInfoResponse?.success) {
      throw new Error(getUserInfoResponse?.error || 'Internal Server Error');
    }

    const user = getUserInfoResponse?.user;
    const totalQuestions = getUserInfoResponse?.totalQuestions;
    const totalAnswers = getUserInfoResponse?.totalAnswers;

    const getLoggedInUserInfoResponse = await getLoggedInUserInfo();
    if (!getLoggedInUserInfoResponse?.success) {
      throw new Error(getUserInfoResponse?.error || 'Internal Server Error');
    }

    const loggedInUserId = getLoggedInUserInfoResponse?.userId;

    return (
      <>
        <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
          <div className="flex flex-col items-start gap-4 lg:flex-row">
            <Image
              src={user?.picture || '/icons/avatar.svg'}
              alt="Profile Picture"
              width={140}
              height={140}
              className="rounded-full object-cover"
            />

            <div className="mt-3">
              <h2 className="h2-bold text-dark100_light900">{user?.name}</h2>
              <p className="paragraph-regular text-dark200_light800">
                @{user?.email}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-start">
                {user.portfolioWebsite && (
                  <ProfileLink
                    imgUrl="/icons/link.svg"
                    href={user.portfolioWebsite}
                    title="Portfolio"
                  />
                )}

                {user.location && (
                  <ProfileLink
                    imgUrl="/icons/location.svg"
                    title={user.location}
                  />
                )}

                <ProfileLink
                  imgUrl="/icons/calendar.svg"
                  title={getJoinedDate(user.createdAt.toString())}
                />
                {}
              </div>

              {user.bio && (
                <p className="paragraph-regular text-dark400_light800 mt-8">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
            {loggedInUserId && loggedInUserId === userId && (
              <Link href="/profile/edit">
                <Button
                  className={
                    'paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3'
                  }
                >
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>

        <Stats totalQuestions={totalQuestions} totalAnswers={totalAnswers} />

        <div className="mt-10 flex gap-10">
          <Tabs>
            <Tabs defaultValue="top-posts" className="flex-1">
              <TabsList
                className={'background-light800_dark400 min-h-[42px] p-1'}
              >
                <TabsTrigger value="top-posts" className="tab">
                  Top Posts
                </TabsTrigger>
                <TabsTrigger value="answers" className="tab">
                  Answer
                </TabsTrigger>
              </TabsList>
              <TabsContent value="top-posts">
                <QuestionTab searchParams={searchParams} userId={user._id} />
              </TabsContent>
              <TabsContent
                value="answers"
                className={'flex w-full flex-col gap-6'}
              >
                <AnswerTab searchParams={searchParams} userId={user._id} />
              </TabsContent>
            </Tabs>
          </Tabs>
        </div>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default Page;
