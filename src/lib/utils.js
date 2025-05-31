import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import { BADGE_CRITERIA } from '@/constants';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Using Chatgpt for calculating getTimeStamp
export const getTimeStamp = createdAt => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMilliseconds / 1000);
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} days ago`;
};

// format number acccordingly for better number views
export function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
}

export function getJoinedDate(isoDate) {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export const formUrlQuery = ({ params, key, value }) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const removeKeysFromQuery = ({ params, keysToRemove }) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach(key => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const assignBadges = params => {
  const badgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;
  criteria.forEach(item => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach(level => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level] += 1;
      }
    });
  });

  return badgeCounts;
};
