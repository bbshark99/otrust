import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { responsive } from 'theme/constants';
import BondLineChart from 'components/Chart/BondLineChart';
import DropDown from 'components/DropDown/DropDown';
import LineChart from 'components/Chart/HistoricalLineChart';
import CandleChart from 'components/Chart/CandleChart';
import { candleHeaderDefault, tempCandlestickData } from 'components/Chart/defaultChartData';
import { HISTORICAL_CHART_TYPE } from '../../constants/ChartSelections';

const ChartWrapper = styled.div`
  padding: 20px;

  position: relative;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

const ChartHeader = styled.header`
  display: flex;
  justify-content: space-between;
  min-height: 35px;
`;

const ChartTypeBtn = styled.button`
  height: 50px;
  padding: 16px 24px;

  background-color: ${props =>
    props.active ? props.theme.colors.bgHighlightBorder : 'transparent'};
  border-radius: 6px;
  border: none;

  color: ${props => props.theme.colors.textPrimary};
  font-size: 12px;
  font-family: 'Poppins', sans-serif;

  cursor: pointer;

  @media screen and (max-width: ${responsive.laptop}) {
    height: 44px;
    padding: 12px 16px;
  }
`;

const XAxis = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;

  color: ${props => props.theme.colors.textPrimary};
  font-size: 11px;

  transform: translateX(-50%);
`;

const YAxis = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;

  color: ${props => props.theme.colors.textPrimary};
  font-size: 11px;

  transform: translateY(-50%) rotate(-90deg);
`;

const axisLabels = {
  lineChart: { x: '', y: 'Price (ETH)' },
  candleView: { x: '', y: 'Price (ETH)' },
  bondingCurve: { x: 'NOM supply', y: 'Price (ETH)' },
};

const ChartSelectorWrapper = styled.div`
  width: 200px;
  position: absolute;
  left: 15px;
`;

const LineChartSelectorWrapper = styled.div`
  position: absolute;
  right: 15px;
`;

const periods = [
  { key: HISTORICAL_CHART_TYPE.DAY, value: 'Day' },
  { key: HISTORICAL_CHART_TYPE.WEEK, value: 'Week' },
  { key: HISTORICAL_CHART_TYPE.MONTH, value: 'Month' },
  { key: HISTORICAL_CHART_TYPE.QUARTAL, value: 'Quartal' },
  { key: HISTORICAL_CHART_TYPE.YEAR, value: 'Year' },
  { key: HISTORICAL_CHART_TYPE.ALL_TIME, value: 'All Time' },
];

const chartTypes = [
  { key: 'bondingCurve', value: 'Bonding Curve Chart' },
  { key: 'lineChart', value: 'Historical Chart' },
  { key: 'candleView', value: 'Candles View' },
];

export default function Chart() {
  const [chartType, setChartType] = useState('bondingCurve');
  const [historicalChartType, setHistoricalChartType] = useState(HISTORICAL_CHART_TYPE.DAY);
  const [isMediaMinSmarthone, setIsMediaMinSmartphone] = useState(undefined);
  const [candleHeaderId] = useState('1');
  const [candleHeader] = useState(candleHeaderDefault);

  const mediaQuery = window.matchMedia('(min-width: 700px)');

  useEffect(() => {
    if (isMediaMinSmarthone === false) {
      setChartType('lineChart');
    } else if (isMediaMinSmarthone === true) {
      setChartType('bondingCurve');
    }
  }, [isMediaMinSmarthone]);

  const smartphoneWidthChangeHandler = useCallback(event => {
    if (event.matches) {
      setIsMediaMinSmartphone(true);
    } else {
      setIsMediaMinSmartphone(false);
    }
  }, []);

  const selectPeriodHandler = selectKeyValue => {
    setHistoricalChartType(selectKeyValue);
  };

  const selectChartTypeHandler = selectKeyValue => {
    setChartType(selectKeyValue);
  };

  useEffect(() => {
    mediaQuery.addListener(smartphoneWidthChangeHandler);
    if (mediaQuery.matches) {
      setIsMediaMinSmartphone(true);
    } else {
      setIsMediaMinSmartphone(false);
    }
    return () => {
      mediaQuery.removeListener(smartphoneWidthChangeHandler);
    };
  }, [smartphoneWidthChangeHandler, mediaQuery]);

  const renderChart = type => {
    switch (type) {
      case 'lineChart':
        return <LineChart historicalChartType={historicalChartType} />;
      case 'candleView':
        return (
          <CandleChart
            candleHeader={candleHeader}
            candleHeaderId={candleHeaderId}
            data={tempCandlestickData}
          />
        );
      case 'bondingCurve':
      default:
        return <BondLineChart />;
    }
  };

  return (
    <ChartWrapper id="tour-chart">
      <ChartHeader>
        {isMediaMinSmarthone === true ? (
          <span>
            <ChartTypeBtn
              onClick={() => setChartType('bondingCurve')}
              active={chartType === 'bondingCurve'}
            >
              Bonding Curve Chart
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={() => setChartType('lineChart')}
              active={chartType === 'lineChart'}
            >
              Historical Chart
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={() => setChartType('candleView')}
              active={chartType === 'candleView'}
            >
              Candles View
            </ChartTypeBtn>
          </span>
        ) : (
          <ChartSelectorWrapper>
            <DropDown selectItems={chartTypes} selectHandler={selectChartTypeHandler} />
          </ChartSelectorWrapper>
        )}
        {chartType === 'lineChart' && (
          <LineChartSelectorWrapper>
            <DropDown selectItems={periods} selectHandler={selectPeriodHandler} />
          </LineChartSelectorWrapper>
        )}
      </ChartHeader>

      <YAxis>{axisLabels[chartType].y}</YAxis>
      <XAxis>{axisLabels[chartType].x}</XAxis>

      {renderChart(chartType)}
    </ChartWrapper>
  );
}
