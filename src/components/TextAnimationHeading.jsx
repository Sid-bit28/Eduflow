'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const TextAnimationHeading = ({ className, classNameAnimationContainer }) => {
  return (
    <div
      className={cn(
        'mx-auto text-2xl lg:text-5xl my-6 flex flex-col gap-3 lg:gap-5 font-bold text-center ',
        className
      )}
    >
      <div className="text-primary-500 drop-shadow-md pl-7">Ask</div>
      <div className={cn('w-fit text-center', classNameAnimationContainer)}>
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'Community 🙌',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'Developers 🔖',
            1000,
            'EduFlow 👋',
            1000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </div>
    </div>
  );
};

export default TextAnimationHeading;
