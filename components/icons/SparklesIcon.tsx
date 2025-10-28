import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.93 2.25 12 7.5l2.07-5.25" />
    <path d="M2.25 9.93 7.5 12l-5.25 2.07" />
    <path d="M9.93 21.75 12 16.5l2.07 5.25" />
    <path d="M21.75 9.93 16.5 12l5.25 2.07" />
  </svg>
);