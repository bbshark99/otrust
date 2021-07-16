import React from 'react';

const formatDecimals = value => {
  if (value === null || value === undefined || value === '') return '';

  let str = `${value}`;
  const index = str.indexOf('.');

  if (index > -1) {
    if (str.length - index > 6) {
      str = `${parseFloat(value).toFixed(6)}...`;
    } else if (index + 1 !== str.length) {
      str = parseFloat(parseFloat(str).toFixed(6));
    }
  }

  return str;
};

export const withTrimmedWrapper = WrappedComponent => {
  return props => {
    const value = formatDecimals(props.value);

    return <WrappedComponent {...props} value={value} />;
  };
};
