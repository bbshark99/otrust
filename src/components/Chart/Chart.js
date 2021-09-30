import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

import { responsive } from 'theme/constants';
import BondLineChart from 'components/Chart/BondLineChart';
import Dropdown from 'components/Dropdown/Dropdown';
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
  { key: 'lineChart', value: 'Historical Chart' },
  { key: 'bondingCurve', value: 'Bonding Curve Chart' },
  { key: 'candleView', value: 'Candles View' },
];

export default function Chart() {
  const [chartType, setChartType] = useState('bondingCurve');
  const [historicalChartType, setHistoricalChartType] = useState(HISTORICAL_CHART_TYPE.DAY);
  const [candleHeaderId] = useState('1');
  const [candleHeader] = useState(candleHeaderDefault);

  const isBigScreen = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  useEffect(() => {
    if (isBigScreen === false) {
      setChartType('lineChart');
    } else {
      setChartType('bondingCurve');
    }
  }, [isBigScreen]);

  const selectPeriodHandler = selectKeyValue => {
    setHistoricalChartType(selectKeyValue);
  };

  const selectChartTypeHandler = selectKeyValue => {
    setChartType(selectKeyValue);
  };

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
        {isBigScreen === true ? (
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
            <Dropdown selectItems={chartTypes} selectHandler={selectChartTypeHandler} />
          </ChartSelectorWrapper>
        )}
        {chartType === 'lineChart' && (
          <LineChartSelectorWrapper>
            <Dropdown selectItems={periods} selectHandler={selectPeriodHandler} />
          </LineChartSelectorWrapper>
        )}
      </ChartHeader>

      <YAxis>{axisLabels[chartType].y}</YAxis>
      <XAxis>{axisLabels[chartType].x}</XAxis>

      {renderChart(chartType)}
    </ChartWrapper>
  );
}
