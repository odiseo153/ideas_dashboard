import React from "react";

type LogoProps = {
  className?: string;
  title?: string;
};

export function Logo({ className, title = "Ideas" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <path
        d="M32 18c-6.6 0-12 5.1-12 11.5 0 4.2 2.1 7.4 5 9.8 1.2 1 2 2.4 2 4v1.2c0 .9.8 1.7 1.7 1.7h6.6c.9 0 1.7-.8 1.7-1.7V43.3c0-1.6.8-3 2-4 2.9-2.4 5-5.6 5-9.8C44 23.1 38.6 18 32 18Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M27.5 47.5h9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M29.5 51h5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}

