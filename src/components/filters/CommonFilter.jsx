'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const CommonFilter = ({ filters, otherClasses, containerClasses }) => {
  return (
    <div className={cn('relative', containerClasses)}>
      <Select onValueChange={() => {}} defaultValue={''}>
        <SelectTrigger
          className={cn(
            'body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5',
            otherClasses
          )}
          aria-label="Filter options"
        >
          <div className="line-clamp-1 flex-1 text-left paragraph-regular text-slate-600">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map(item => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="line-clamp-1 flex-1 text-left paragraph-regular text-slate-600"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
