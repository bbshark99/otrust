import React, { useState } from 'react';
import styled from 'styled-components';

import { responsive } from 'theme/constants';
import BondLineChart from 'components/Chart/BondLineChart';
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
  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: none;
  }
`;

const ChartTypeBtn = styled.button`
  height: 50px;
  padding: 16px 24px;

  background-color: ${props => (props.active ? props.theme.colors.bgHighlightBorder : 'transparent')};
  border-radius: 6px;
  border: none;

  color: ${props => props.theme.colors.textPrimary};
  font-size: 12px;

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

export default function Chart() {
  const [chartType, setChartType] = useState('bondingCurve');
  const [historicalChartType, setHistoricalChartType] = useState(HISTORICAL_CHART_TYPE.DAY);

  const [candleHeaderId] = useState('1');
  const [candleHeader] = useState(candleHeaderDefault);

  const renderChart = type => {
    switch (type) {
      case 'lineChart':
        return <LineChart historicalChartType={historicalChartType} />;
      case 'candleView':
        return <CandleChart candleHeader={candleHeader} candleHeaderId={candleHeaderId} data={tempCandlestickData} />;
      case 'bondingCurve':
      default:
        return <BondLineChart />;
    }
  };

  return (
    <ChartWrapper id="tour-chart">
      <ChartHeader>
        <span>
          <ChartTypeBtn onClick={() => setChartType('bondingCurve')} active={chartType === 'bondingCurve'}>
            Bonding Curve Chart
          </ChartTypeBtn>
          <ChartTypeBtn onClick={() => setChartType('lineChart')} active={chartType === 'lineChart'}>
            Historical Chart
          </ChartTypeBtn>
          <ChartTypeBtn onClick={() => setChartType('candleView')} active={chartType === 'candleView'}>
            Candles View
          </ChartTypeBtn>
        </span>
        {chartType === 'lineChart' && (
          <span>
            <ChartTypeBtn
              onClick={event => {
                event.stopPropagation();
                setHistoricalChartType(HISTORICAL_CHART_TYPE.DAY);
              }}
              active={historicalChartType === HISTORICAL_CHART_TYPE.DAY}
            >
              Day
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={event => {
                event.stopPropagation();
                setHistoricalChartType(HISTORICAL_CHART_TYPE.WEEK);
              }}
              active={historicalChartType === HISTORICAL_CHART_TYPE.WEEK}
            >
              Week
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={event => {
                event.stopPropagation();
                setHistoricalChartType(HISTORICAL_CHART_TYPE.MONTH);
              }}
              active={historicalChartType === HISTORICAL_CHART_TYPE.MONTH}
            >
              Month
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={event => {
                event.stopPropagation();
                setHistoricalChartType(HISTORICAL_CHART_TYPE.QUARTAL);
              }}
              active={historicalChartType === HISTORICAL_CHART_TYPE.QUARTAL}
            >
              Quartal
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={event => {
                event.stopPropagation();
                setHistoricalChartType(HISTORICAL_CHART_TYPE.YEAR);
              }}
              active={historicalChartType === HISTORICAL_CHART_TYPE.YEAR}
            >
              Year
            </ChartTypeBtn>
            <ChartTypeBtn
              onClick={event => {
                event.stopPropagation();
                setHistoricalChartType(HISTORICAL_CHART_TYPE.ALL_TIME);
              }}
              active={historicalChartType === HISTORICAL_CHART_TYPE.ALL_TIME}
            >
              All Time
            </ChartTypeBtn>
          </span>
        )}
      </ChartHeader>

      <YAxis>{axisLabels[chartType].y}</YAxis>
      <XAxis>{axisLabels[chartType].x}</XAxis>

      {renderChart(chartType)}
    </ChartWrapper>
  );
}
