'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import React from 'react';

const Page = () => {
  return (
    <div>
      Page
      <Button
        variant={'destructive'}
        className="w-full mt-4 cursor-pointer"
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </div>
  );
};

export default Page;
