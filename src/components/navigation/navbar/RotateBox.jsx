'use client';

import { useTheme } from '@/context/ThemeProvider';
import { useState } from 'react';

export default function RotateBox({ children }) {
  const { mode, setMode } = useTheme();
  const [rotated, setRotated] = useState(false);

  const handleClick = () => {
    setRotated(!rotated);
    setMode(!mode);
    if (mode) {
      localStorage.theme = 'dark';
    } else localStorage.theme = 'light';
  };

  return (
    <div
      onClick={handleClick}
      className={`p-2 rounded-full hover:bg-primary-500/10 hover:dark:bg-primary-500/10 transition-transform duration-500 cursor-pointer ${
        rotated ? 'rotate-45' : 'rotate-0'
      }`}
    >
      {children}
    </div>
  );
}
