'use client';

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import ROUTES from '@/constants/routes';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-6">
      {sidebarLinks.map(item => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
                  : 'text-dark300_light900'
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  const session = useSession();
  const userName = session?.data?.user?.name || 'User';
  const [loading, isLoading] = useState();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="background-light900_dark200 border-none overflow-y-auto no-scrollbar p-3"
      >
        <SheetTitle className={'hidden'}>Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/site-logo.svg"
            width={23}
            height={23}
            alt="logo"
          />

          <p className="h2-bold text-dark100_light900">
            Edu <span className="text-primary-500">Flow</span>
          </p>
        </Link>

        <SheetDescription className={'mx-auto'}>
          <span className="h1-bold text-primary-500">W</span>
          <span className="h2-bold">elcome</span>{' '}
          <span className="h1-bold primary-text-gradient">{userName[0]}</span>
          <span className="h2-bold primary-text-gradient">
            {userName.substring(1)}
          </span>
        </SheetDescription>
        <div className="no-scrollbar flex grow flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
        <div>
          {!session?.data?.user ? (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href={ROUTES.SIGN_IN}>
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={ROUTES.SIGN_UP}>
                  <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <SheetClose asChild>
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer">
                <span className="primary-text-gradient">LogOut</span>
              </Button>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
