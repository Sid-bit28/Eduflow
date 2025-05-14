import ROUTES from '@/constants/routes';
import Axios from '@/lib/Axios';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';
import DataRenderer from '../DataRenderer';

const UserCard = async ({ user }) => {
  const response = await Axios.get(`/api/tag/${user._id}`);
  console.log(response.data);
  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Link href={ROUTES.PROFILE(user._id)}>
          <Image
            src={user.picture || '/icons/avatar.svg'}
            alt="User Profile Pic"
            width={100}
            height={100}
            className="rounded-full"
          />
        </Link>

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.email}
          </p>
        </div>

        <div className="mt-5">
          {response.data.length > 0 ? (
            <div className="flex items-center gap-2">
              {response.data.map(tag => (
                <DataRenderer key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No Tags Yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
