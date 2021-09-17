import React from 'react';

export function LogoWhite({ width, height }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 48">
      <path
        fill="#fff"
        d="M41.255 48H6.745A6.755 6.755 0 010 41.255V6.745A6.755 6.755 0 016.745 0h34.51A6.755 6.755 0 0148 6.745v34.51A6.755 6.755 0 0141.255 48z"
      />
      <g fill="#4877c1">
        <path d="M16.7 12.9h4.914v22.213H16.7z" />
        <path d="M27.206 20.218h-.709v14.881h4.76v-10.86a4.06 4.06 0 00-4.051-4.021z" />
      </g>
    </svg>
  );
}
