'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import NavLinks from './navbar/NavLinks';
import { SheetClose } from '../ui/sheet';
import ROUTES from '@/constants/routes';
import Image from 'next/image';

const LeftSidebar = () => {
  const session = useSession();

  return (
    <section className="background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-2">
        <NavLinks userId={session?.data?.user?.id} />
      </div>
      <div>
        {!session?.data?.user ? (
          <div className="flex flex-col gap-3">
            <Link href={ROUTES.SIGN_IN}>
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer">
                <Image
                  src={'/icons/account.svg'}
                  alt="login"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Button>
            </Link>

            <Link href={ROUTES.SIGN_UP}>
              <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none cursor-pointer">
                <Image
                  src={'/icons/sign-up.svg'}
                  alt="login"
                  width={20}
                  height={20}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Sign Up
                </span>
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer"
            onClick={() => signOut()}
          >
            <Image
              src={'/icons/trash.svg'}
              alt="login"
              width={20}
              height={20}
              className="invert-colors lg:hidden"
            />
            <span className="primary-text-gradient max-lg:hidden">LogOut</span>
          </Button>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;
