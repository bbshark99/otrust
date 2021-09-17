import React from 'react';

export function DotsIcon({ onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="0 0 26 26.7"
      onClick={onClick}
    >
      <g id="DotsIcon" cursor="pointer" pointerEvents="all">
        <path
          fill="#a7b0c3"
          d="M16 10.666A2.667 2.667 0 1013.333 8 2.675 2.675 0 0016 10.666zm0 2.667A2.667 2.667 0 1018.667 16 2.675 2.675 0 0016 13.333zm0 8A2.667 2.667 0 1018.667 24 2.675 2.675 0 0016 21.333z"
        />
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </g>
    </svg>
  );
}
