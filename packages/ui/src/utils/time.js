const SECONDS_IN_ONE_DAY = 86400;

export const getTimeStampDaysAgo = numberOfDays => {
  const date = new Date();
  return Math.floor(date.getTime() / 1000 - numberOfDays * SECONDS_IN_ONE_DAY).toString();
};

export const getTimeStampMonthsAgo = numberOfMonths => {
  const date = new Date();
  date.setMonth(date.getMonth() - numberOfMonths);
  return Math.floor(date.getTime() / 1000).toString();
};
