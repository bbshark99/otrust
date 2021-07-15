import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import {
  extent,
  format,
  select,
  scaleTime,
  scaleLinear,
  schemeSet1,
  axisBottom,
  axisLeft,
  timeFormat,
  max,
  min,
} from 'd3';

import { ChainContext } from 'context/chain/ChainContext';
import { useResizeObserver } from './utils';

const StyledSVG = styled.svg`
  display: block;
  width: 100%;
  overflow: visible;
`;

function CandleChart(props) {
  const id = 'candleChart';
  const margin = { top: 20, right: 20, bottom: 40, left: 90 };
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { theme } = useContext(ChainContext);

  //temporary check to stop errors when svg/wrapper/data isn't loaded yet
  if (svgRef.current !== undefined && wrapperRef.current !== undefined && props.data !== undefined) {
    let data = props.data;
    data.map(m => (m.timestamp = String(m.timestamp).length === 10 ? new Date(+m.timestamp * 1000) : m.timestamp));
    const time_period = props.candleHeader[props.candleHeaderId].id;
    const tick_count = { Week: 7, '1H': 12 };
    const time_formats = { Week: '%a', '1H': '%I:%M' };
    const x_ticks = tick_count[time_period];
    const x_format = time_formats[time_period];
    //set other constants.
    const width = dimensions.width;
    const height = dimensions.height;
    const numberFormat = format('.6s');
    const svg = select(svgRef.current);

    const x_var = 'timestamp';
    const minVar = 'low';
    const maxVar = 'high';

    function xValue(d) {
      return d[x_var];
    } // accessors

    const xScale = scaleTime()
      .domain(extent(data, xValue))
      .range([margin.left, width - margin.right]);

    let rectWidth = ((width - margin.left - margin.right) / data.length) * 0.95;
    if (rectWidth > 10) {
      rectWidth = 10;
    }
    var yMin = min(data, d => d[minVar]);
    var yMax = max(data, d => d[maxVar]);

    const yScale = scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin.top - margin.bottom, 10]);

    //hide axis paths (horizontal lines)
    select('.x-axis path').style('display', 'none');
    select('.x-axis1 path').style('display', 'none');

    // x axis with text
    const xAxis = axisBottom(xScale)
      .tickSize('15')
      .ticks(x_ticks)
      .tickFormat(d => timeFormat(x_format)(d));
    //copied from BondLineChart
    const xComplex = svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
      .style('color', `${theme.colors.bgHighlight}`)
      .attr('stroke-width', '0.10rem')
      .call(xAxis);

    xComplex
      .selectAll('.tick text')
      .attr('transform', `translate(0, 10)`)
      .style('color', `${theme.colors.textThirdly}`)
      .style('font-size', '0.7rem');

    xComplex.selectAll('.tick line').style('color', `${theme.colors.bgHighlight}`);

    //x Axis minor - copied from BondLineChart
    const xAxis1 = axisBottom(xScale).tickSize('10').ticks(25).tickFormat([]);

    const xComplex1 = svg
      .select('.x-axis1')
      .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
      .style('color', `${theme.colors.bgHighlight}`)
      .call(xAxis1);

    xComplex1.selectAll('.tick line').style('stroke-width', '0.1rem').style('color', `${theme.colors.bgHighlight}`);

    // y Axis and gridlines
    const gridlinesSize = width - margin.right - margin.left;
    const yAxis = axisLeft(yScale).tickFormat(numberFormat).tickSizeInner(-gridlinesSize);
    const yComplex = svg
      .select('.y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .style('color', `${theme.colors.bgDarken}`)
      .call(yAxis);

    yComplex.selectAll('.tick text').style('color', `${theme.colors.txtThirdly}`);

    yComplex.selectAll('.tick line').style('color', `${theme.colors.bgNormal}`);

    var candleElements = svg
      .selectAll('.candlestickGroup')
      .data(data)
      .join(function (group) {
        var enter = group.append('g').attr('class', 'candlestickGroup');
        enter.append('line').attr('class', 'candlestickRect');
        enter.append('line').attr('class', 'candlestickLine');
        return enter;
      });

    candleElements
      .select('.candlestickLine')
      .attr('stroke', d => (d.open > d.close ? schemeSet1[0] : d.close > d.open ? schemeSet1[2] : schemeSet1[8]))
      .attr('stroke-width', 1)
      .attr('x1', d => xScale(d[x_var]))
      .attr('x2', d => xScale(d[x_var]))
      .attr('y1', d => yScale(d[minVar]))
      .attr('y2', d => yScale(d[maxVar]));

    candleElements
      .select('.candlestickRect')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', rectWidth)
      .attr('stroke', d => (d.open > d.close ? schemeSet1[0] : d.close > d.open ? schemeSet1[2] : schemeSet1[8]))
      .attr('x1', d => xScale(d[x_var]))
      .attr('x2', d => xScale(d[x_var]))
      .attr('y1', d => yScale(d.open))
      .attr('y2', d => yScale(d.close));
  }
  return (
    <div ref={wrapperRef} style={{ marginTop: '1rem', height: '400px' }} data-testid="candle-chart">
      <StyledSVG ref={svgRef} data-testid="candle-chart-svg">
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width="100%" height="100%" />
          </clipPath>
        </defs>
        <g className="content" clipPath={`url(#${id})`}>
          <g className="candlestickGroup" />
        </g>
        <g className="y-axis" />
        <g className="x-axis1" />
        <g className="x-axis" />
      </StyledSVG>
    </div>
  );
}

export default CandleChart;
