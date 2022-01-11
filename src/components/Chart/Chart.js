import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

import { responsive } from 'theme/constants';
import BondLineChart from 'components/Chart/BondLineChart';
import Dropdown from 'components/Dropdown/Dropdown';
import { TVChartContainer } from './TradingViewChart';

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
  tradingView: { x: 'Time', y: 'Price' },
};

const ChartSelectorWrapper = styled.div`
  width: 200px;
  position: absolute;
  left: 15px;
`;

const chartTypes = [
  { key: 'bondingCurve', value: 'Bonding Curve Chart' },
  { key: 'tradingView', value: 'Trading View' },
];

export default function Chart() {
  const [chartType, setChartType] = useState('bondingCurve');

  const isBigScreen = useMediaQuery({ minWidth: responsive.smartphoneLarge });

  useEffect(() => {
    if (isBigScreen === false) {
      setChartType('lineChart');
    } else {
      setChartType('bondingCurve');
    }
  }, [isBigScreen]);

  const selectChartTypeHandler = selectKeyValue => {
    setChartType(selectKeyValue);
  };

  const renderChart = type => {
    switch (type) {
      case 'tradingView':
        return <TVChartContainer />;
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
              onClick={() => setChartType('tradingView')}
              active={chartType === 'tradingView'}
            >
              Trading View
            </ChartTypeBtn>
          </span>
        ) : (
          <ChartSelectorWrapper>
            <Dropdown selectItems={chartTypes} selectHandler={selectChartTypeHandler} />
          </ChartSelectorWrapper>
        )}
      </ChartHeader>

      <YAxis>{axisLabels[chartType].y}</YAxis>
      <XAxis>{axisLabels[chartType].x}</XAxis>

      {renderChart(chartType)}
    </ChartWrapper>
  );
}
