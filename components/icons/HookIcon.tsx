import React from 'react';

export const HookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M18 9v6a3 3 0 0 1-3 3h- эсте-3a3 3 0 0 1-3-3V9" />
    <path d="M12 9A3 3 0 0 0 9 6a3 3 0 0 0-3 3" />
    <path d="M6 9h.01" />
  </svg>
);