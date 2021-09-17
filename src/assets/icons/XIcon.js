import React from 'react';

export function XIcon({ onClick, fillColor }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="0 0 20 20"
      onClick={onClick}
    >
      <g id="XIcon" fill={fillColor} cursor="pointer" pointerEvents="all">
        <rect x="1" y="9" rx="1" ry="1" width="18" height="2" transform="rotate(45 10 10)" />
        <rect x="1" y="9" rx="1" ry="1" width="18" height="2" transform="rotate(-45 10 10)" />
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </g>
    </svg>
  );
}
