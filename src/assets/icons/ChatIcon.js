import React from 'react';

export function ChatIcon({ onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="3 3 26 26"
      onClick={onClick}
    >
      <g id="ChatIcon" fill="#a7b0c3" cursor="pointer" pointerEvents="all">
        <path d="M3.473 25.809a2.122 2.122 0 002.718 2.718l3.9-.945A12.64 12.64 0 0016 29a12.917 12.917 0 10-11.582-7.032l-.945 3.841zm3.368-3.723a1.181 1.181 0 00-.118-.886 10.64 10.64 0 114.077 4.077 1.146 1.146 0 00-.886-.118l-4.136 1 1.064-4.077zm14.477-7.268a1.182 1.182 0 000-2.364H10.682a1.182 1.182 0 100 2.364zm0 4.727a1.182 1.182 0 000-2.364h-7.091a1.182 1.182 0 000 2.364z" />
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </g>
    </svg>
  );
}
