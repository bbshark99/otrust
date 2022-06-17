import React from 'react';

export function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="2 2 12 11"
      style={{ pointerEvents: 'none' }}
    >
      <g id="PlusIcon" fill="#4877c1">
        <path d="M5.183 16c0-.633.516-1.15 1.15-1.15h8.517V6.335a1.151 1.151 0 012.3 0v8.517h8.517a1.151 1.151 0 010 2.3H17.15v8.517a1.151 1.151 0 01-2.3 0V17.15H6.333c-.634 0-1.15-.516-1.15-1.15z" />
        <path d="M5.333 16a1 1 0 001 1H15v8.668a1 1 0 002 0V17h8.667a1 1 0 100-2H17V6.334a1 1 0 00-2 0V15H6.333a1 1 0 00-1 1m-.3 0c0-.717.584-1.3 1.3-1.3H14.7V6.334c0-.717.583-1.3 1.3-1.3s1.3.583 1.3 1.3V14.7h8.367c.717 0 1.3.583 1.3 1.3 0 .717-.583 1.3-1.3 1.3H17.3v8.367c0 .716-.583 1.3-1.3 1.3-.717 0-1.3-.584-1.3-1.3V17.3H6.333c-.716 0-1.3-.583-1.3-1.3z" />
      </g>
    </svg>
  );
}

export function FeedPlusIcon({ onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="0 0 20 20"
      onClick={onClick}
    >
      <g id="FeedPlusIcon" fill="#a7b0c3" cursor="pointer" pointerEvents="all">
        <rect x="1" y="9" rx="1" ry="1" width="18" height="2" />
        <rect x="9" y="1" rx="1" ry="1" width="2" height="18" />
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </g>
    </svg>
  );
}

export function FeedMinusIcon({ onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="0 0 20 20"
      onClick={onClick}
    >
      <g id="FeedMinusIcon" fill="#a7b0c3" cursor="pointer" pointerEvents="all">
        <rect x="1" y="9" rx="1" ry="1" width="18" height="2" />
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </g>
    </svg>
  );
}

export function SmallPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <g>
        <g>
          <g fill="#4877c1">
            <path d="M5.084 12.001c0-.483.392-.875.875-.875h5.166V5.959a.876.876 0 011.75 0v5.167h5.167a.876.876 0 010 1.75h-5.167v5.167a.876.876 0 01-1.75 0v-5.167H5.96A.876.876 0 015.084 12z" />
            <path d="M5.334 12.001c0 .345.28.625.625.625h5.416v5.417a.625.625 0 001.25 0v-5.417h5.417a.625.625 0 000-1.25h-5.417V5.959a.625.625 0 10-1.25 0v5.417H5.96a.625.625 0 00-.625.625m-.5 0c0-.62.504-1.125 1.125-1.125h4.916V5.959a1.126 1.126 0 012.25 0v4.917h4.917a1.126 1.126 0 010 2.25h-4.917v4.917a1.126 1.126 0 01-2.25 0v-4.917H5.96c-.62 0-1.125-.505-1.125-1.125z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
