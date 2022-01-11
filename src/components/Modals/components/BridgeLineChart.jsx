import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { select, line, curveCardinal, axisLeft, axisBottom, scaleLinear } from 'd3';

const StyledSVG = styled.svg`
  width: 100%;
  height: ${props => props.chartHeight}px;
  margin: 20px 0 50px;
  padding: 0 ${props => props.sidePadding}px;

  background-color: transparent;
  overflow: visible;

  color: #656273;

  .tooltip {
    width: 100px;
    height: 100px;

    fill: #fff;
  }
`;

const ChartCaption = styled.h3`
  margin: 0 0 2em;

  font-size: 16px;
  text-align: center;

  strong {
    color: #88d1ff;
  }
`;

export default function BridgeLineChart({
  peakHeight,
  peakPosition,
  standardDeviation,
  totalCoins,
  coinsInCirculation,
}) {
  const [data, setData] = useState([]);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [activePoint, setActivePoint] = useState(0);
  const [activePointIndex, setActivePointIndex] = useState(0);

  // refs
  const svgRef = useRef();
  const wrapperRef = useRef();

  // constants
  const WRAPPER_SIDE_PADDING = 40;
  const CHART_HEIGHT = 200;
  const CHART_DATA_STEP = 10000000;

  // utils
  const applyFormula = useCallback(
    value =>
      peakHeight * Math.exp((-1 * (value - peakPosition) ** 2) / (2 * standardDeviation ** 2)),
    [peakHeight, peakPosition, standardDeviation]
  );

  const updateWrapperWidth = useCallback(
    () => setWrapperWidth(wrapperRef?.current?.offsetWidth - WRAPPER_SIDE_PADDING * 2),
    [setWrapperWidth, wrapperRef]
  );

  const getActivePointIndex = useCallback(
    value => {
      const closest = data?.reduce(
        (prev, curr) => (Math.abs(curr - value) > Math.abs(prev - value) ? prev : curr),
        0
      );
      return data.indexOf(closest);
    },
    [data]
  );

  // effects
  useEffect(() => {
    updateWrapperWidth();

    window.addEventListener('resize', updateWrapperWidth);
    return () => {
      window.removeEventListener('resize', updateWrapperWidth);
    };
  }, [updateWrapperWidth]);

  useEffect(() => {
    const generatedData = [];

    for (let i = 0; i <= totalCoins; i += CHART_DATA_STEP) {
      generatedData.push(i);
    }

    setData(generatedData);
  }, [setData, totalCoins]);

  useEffect(() => {
    setActivePointIndex(getActivePointIndex(coinsInCirculation));
  }, [coinsInCirculation, getActivePointIndex]);

  useEffect(() => {
    const svg = select(svgRef.current);

    // Scales
    const xScale = scaleLinear().domain([0, totalCoins]).range([0, wrapperWidth]);
    const yScale = scaleLinear().domain([0, 100]).range([CHART_HEIGHT, 0]);

    const gradientStops = [
      { offset: '0%', color: '#88d1ff' },
      { offset: xScale(data[activePointIndex]), color: '#88d1ff' },
      { offset: xScale(data[activePointIndex]), color: '#302e3d' },
    ];

    // X Axis
    const xAxis = axisBottom(xScale)
      .ticks(6)
      .tickFormat(d => `${d / 1000000}m`);

    svg
      .select('.x-axis')
      .style('transform', `translateY(${CHART_HEIGHT}px)`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').style('font-size', '12px').style('font-weight', '500'))
      .call(g => g.selectAll('.tick line').remove());

    // Y Axis
    const yAxis = axisLeft(yScale)
      .ticks(6)
      .tickFormat(d => `${d}%`);

    svg
      .select('.y-axis')
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').style('font-size', '12px').style('font-weight', '500'))
      .call(g => g.selectAll('.tick line').attr('x2', '100%').attr('stroke', '#302e3d'));

    // Line Color
    svg
      .select('defs')
      .select('linearGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')
      .selectAll('stop')
      .data(gradientStops)
      .join('stop')
      .transition()
      .duration(800)
      .attr('offset', d => `${(100 * d.offset) / wrapperWidth}%`)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', 1);

    // Line
    const APYline = line()
      .x(d => xScale(d))
      .y(d => yScale(applyFormula(d)))
      .curve(curveCardinal);

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('d', APYline)
      .attr('stroke', 'url(#lineColor)');

    // Active Point
    svg
      .selectAll('g.activePoint')
      .data([data[activePointIndex]])
      .style('transform', d => {
        const x = `${xScale(d)}px`;
        const y = `${yScale(applyFormula(d)) + 50}px`;

        return `translate(${x}, ${y})`;
      })
      .transition()
      .delay(100)
      .style('transform', d => {
        const x = `${xScale(d)}px`;
        const y = `${yScale(applyFormula(d))}px`;

        return `translate(${x}, ${y})`;
      })
      .style('opacity', 1)
      .call(g =>
        g.select('text').text(d => {
          const calculatedPointValue = d && applyFormula(d).toFixed(0);
          setActivePoint(calculatedPointValue);
          return `${calculatedPointValue}%`;
        })
      );
  }, [data, activePointIndex, totalCoins, applyFormula, wrapperWidth]);

  return (
    <div ref={wrapperRef}>
      <ChartCaption>
        Bridge to earn up to <strong>{activePoint}%</strong> APY with Staking Rewards!
      </ChartCaption>
      <StyledSVG ref={svgRef} chartHeight={CHART_HEIGHT} sidePadding={WRAPPER_SIDE_PADDING}>
        <defs>
          <linearGradient id="lineColor" gradientUnits="userSpaceOnUse" />
        </defs>
        <g className="y-axis">
          <text fill="#656273" style={{ transform: 'rotate(-90deg) translate(-10%, -50px)' }}>
            Block reward
          </text>
        </g>
        <g className="x-axis">
          <text fill="#656273" style={{ transform: 'translate(50%, 40px)' }}>
            Coins in circulation
          </text>
        </g>
        <path className="line" fill="none" strokeWidth={3} />
        <g className="activePoint" style={{ opacity: 0 }}>
          <circle r={7} fill="#1a1723" cx={0} cy={0} stroke="#87d1ff" strokeWidth={3} />
          <rect id="valueTooltip" rx="4" x={-25} y={-40} fill="#87d1ff" width={50} height={25} />
          <text fill="#1a1723" x={0} y={-23} textAnchor="middle" fontSize={12} fontWeight={500} />
        </g>
      </StyledSVG>
    </div>
  );
}
