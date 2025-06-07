import { getUserById } from '@/app/actions/user.action';
import ErrorComponent from '@/components/ErrorComponent';
import ProfileForm from '@/components/forms/ProfileForm';
import ROUTES from '@/constants/routes';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: 'Edit Profile | Eduflow',
  description: 'Edit your profile and get answers from the community.',
};

const Page = async ({ params }) => {
  try {
    const getUserByIdResponse = await getUserById();
    if (!getUserByIdResponse?.success) {
      throw new Error(getUserByIdResponse?.error || 'Internal Server Error');
    }
    const user = getUserByIdResponse?.user;
    if (!user) {
      return {
        redirect: {
          destination: ROUTES.SIGN_IN,
          permanent: false,
        },
      };
    }

    return (
      <>
        <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

        <div className="mt-9">
          <ProfileForm userId={user._id} user={JSON.stringify(user)} />
        </div>
      </>
    );
  } catch (error) {
    return <ErrorComponent error={error} />;
  }
};

export default Page;
