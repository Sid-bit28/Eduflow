import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProfileLink = ({ imgUrl, href, title }) => {
  return (
    <div className="flex-center gap-1 mx-2">
      <Image src={imgUrl} alt="icon" width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          className="text-blue-500 paragraph-medium"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
