import { getTimeStampDaysAgo, getTimeStampMonthsAgo } from '../utils/time';

export const HISTORICAL_CHART_TYPE = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  QUARTAL: 'QUARTAL',
  YEAR: 'YEAR',
  ALL_TIME: 'ALL_TIME',
};

export const HISTORICAL_CHART_TYPE_FILTER = {
  DAY: 'Minute',
  WEEK: 'QuarterHour',
  MONTH: 'Hour',
  QUARTAL: 'QuarterDay',
  YEAR: 'Day',
  ALL_TIME: 'Week',
};

export const HISTORICAL_CHART_TYMESTAMPS = {
  DAY: getTimeStampDaysAgo(1),
  WEEK: getTimeStampDaysAgo(7),
  MONTH: getTimeStampMonthsAgo(1),
  QUARTAL: getTimeStampMonthsAgo(3),
  YEAR: getTimeStampMonthsAgo(12),
  ALL_TIME: 0,
};
