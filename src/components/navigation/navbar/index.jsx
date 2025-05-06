'use client';

import ROUTES from '@/constants/routes';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Theme from './Theme';
import UserAvatar from '@/components/UserAvatar';
import MobileNavigation from './MobileNavigation';
import GlobalSearch from '@/components/search/GlobalSearch';

const Navbar = () => {
  const session = useSession();

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href={ROUTES.HOME} className="flex items-center gap-1">
        <Image src="/images/site-logo.svg" width={23} height={23} alt="logo" />
        <p className="h2-bold text-dark-100 dark:text-light-900 max-sm:hidden">
          Edu <span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className="flex-between gap-5">
        <Theme />
        {session?.data?.user?.id && <UserAvatar />}

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
