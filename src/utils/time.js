const SECONDS_IN_ONE_DAY = 86400;

export const getTimeStampDaysAgo = numberOfDays => {
  const date = new Date();
  return date.getTime() / 1000 - numberOfDays * SECONDS_IN_ONE_DAY;
};

export const getTimeStampMonthsAgo = numberOfMonths => {
  const date = new Date();
  date.setMonth(date.getMonth() - numberOfMonths);
  return date.getTime() / 1000;
};
