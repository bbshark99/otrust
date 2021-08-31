import React, { useContext, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { BigNumber } from 'bignumber.js';
import styled from 'styled-components';
import {
  extent,
  select,
  scaleTime,
  scaleLinear,
  line,
  sort,
  ascending,
  descending,
  axisBottom,
  axisLeft,
  timeFormat,
  format,
  timeMinute,
  interpolate,
} from 'd3';

import { useResizeObserver } from './utils';
import { ChainContext } from 'context/chain/ChainContext';
import { HISTORICAL_CHART_TYPE_FILTER, HISTORICAL_CHART_TYMESTAMPS } from '../../constants/ChartSelections';

const StyledSVG = styled.svg`
  display: block;
  width: 100%;
  overflow: visible;
`;

let dot_index = 0;

const WNOM_HISTORICAL_DATA_QUERY = gql`
  query transactions($filter: String!) {
    wnomhistoricalFrames(first: 1000, skip: 0, where: { type: $filter }, orderBy: startTime, orderDirection: asc) {
      startTime
      startPrice
      endPrice
    }
  }
`;

const LineChart = React.memo(props => {
  const { historicalChartType } = props;
  const { data: bondData } = useQuery(WNOM_HISTORICAL_DATA_QUERY, {
    variables: { filter: HISTORICAL_CHART_TYPE_FILTER[historicalChartType] },
  });

  const id = 'historicalChart';
  const lineGradient = 'historicalChartGradient';
  const margin = { top: 20, right: 20, bottom: 40, left: 90 };
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { theme } = useContext(ChainContext);

  //temporary check to stop errors when svg/wrapper/data isn't loaded yet
  if (svgRef.current !== undefined && wrapperRef.current !== undefined && bondData !== undefined) {
    //define data, change timestamp to date format and build y_var
    let data = bondData.wnomhistoricalFrames;
    const secondsTimeStampNow = Math.floor(new Date().getTime() / 1000).toString();
    let lastElement = data.slice(-1)[0];
    if (data.length) {
      data = data.concat([
        {
          startPrice: lastElement.endPrice,
          startTime: secondsTimeStampNow,
        },
      ]);
    }

    data = data.filter(m => m.startTime > HISTORICAL_CHART_TYMESTAMPS[historicalChartType]);

    if (data.length === 1) {
      data = [
        {
          startPrice: lastElement.startPrice,
          startTime: HISTORICAL_CHART_TYMESTAMPS[historicalChartType],
        },
      ].concat(data);
    }

    data = data.map(m => ({
      ...m,
      startTime: m.startTime.length === 10 ? new Date(+m.startTime * 1000) : m.startTime,
      startPrice: BigNumber(m.startPrice).shiftedBy(-18).toFixed(10),
    }));

    //constants so easy to change
    const x_var = 'startTime';
    const y_var = 'startPrice';
    //make sure data is ordered by timestamp
    data = sort(data, (a, b) => ascending(a[x_var], b[x_var]));

    //fetch time period and set ticks.  current data is week (although as only one day should be day maybe?)
    //but need to define count/format for all periods.
    const time_period = historicalChartType;
    const tick_count = { DAY: 6, WEEK: 7, MONTH: 8, QUARTAL: 6, YEAR: 6, ALL_TIME: 12 };
    const time_formats = {
      DAY: '%H:%M',
      WEEK: '%a',
      MONTH: '%d, %m',
      QUARTAL: '%d, %m',
      YEAR: '%b-%y',
      ALL_TIME: '%m-%Y',
    };
    const x_ticks = tick_count[time_period];
    const x_format = time_formats[time_period];
    //set other constants.
    const width = dimensions.width;
    const height = dimensions.height;
    const numberFormat = format('.6s');
    const svg = select(svgRef.current);
    const svgContent = svg.select('.content');

    function xValue(d) {
      return d[x_var];
    } // accessors
    function yValue(d) {
      return d[y_var];
    }

    const xScale = scaleTime()
      .domain(extent(data, xValue))
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([height - margin.top - margin.bottom, 10])
      .nice();

    const lineGenerator = line()
      .x(d => xScale(d[x_var]))
      .y(d => yScale(d[y_var]));

    //highlited line and highlited area with linearGradient
    const linearGradient = select('#' + lineGradient)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', theme.colors.bgDarken); //

    linearGradient.append('stop').attr('offset', '20%').attr('stop-color', theme.colors.highlightYellow); //

    linearGradient.append('stop').attr('offset', '100%').attr('stop-color', theme.colors.highlightYellow);

    //mouse move rect position
    select('#' + id)
      .select('rect')
      .style('height', height)
      .style('width', width);
    //mouse move objects (start hidden)

    //highlight Rect (defined in render) - rect behind dot which moves
    select('.highlightRect')
      .attr('visibility', 'hidden')
      .attr('pointer-events', 'none')
      .attr('stroke', 0)
      .attr('fill', theme.colors.bgHighlight)
      .attr('fill-opacity', 0.5)
      .attr('x', -24 + margin.left)
      .attr('y', 0)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', 48)
      .attr('height', height - margin.top - margin.bottom);
    //highlightYRect (defined in render) - rect on Y axis with value
    select('.highlightYRect')
      .attr('visibility', 'hidden')
      .attr('stroke', 0)
      .attr('fill', theme.colors.highlightYellow)
      .attr('x', -57 + margin.left)
      .attr('y', 0)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', 57)
      .attr('height', 25)
      .attr('transform', 'translate(0,-12.5)');
    //highlightYText (defined in render) - text on rect on Y axis with value
    select('.highlightYText')
      .attr('visibility', 'hidden')
      .attr('text-anchor', 'middle')
      .style('font-size', '0.7rem')
      .attr('dy', 2.5)
      .attr('x', -28.5 + margin.left)
      .attr('y', 0);
    //highlightYLine (defined in render) - white line left to right
    select('.highlightYLine')
      .attr('visibility', 'hidden')
      .attr('stroke', theme.colors.textPrimary)
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('x1', xScale(data[0][x_var]))
      .attr('x2', xScale(data[data.length - 1][x_var]))
      .attr('y1', margin.left)
      .attr('y2', margin.left)
      .style('cursor', 'crosshair')
      .style('stroke-dasharray', '4,4');
    //highlightXLine (defined in render) - white line top to bottom
    select('.highlightXLine')
      .attr('visibility', 'hidden')
      .attr('stroke', theme.colors.textPrimary)
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('x1', margin.left)
      .attr('x2', margin.left)
      .attr('y1', margin.top - 10)
      .attr('y2', height - margin.top - margin.bottom)
      .style('cursor', 'crosshair')
      .style('stroke-dasharray', '4,4');
    //highlightXText (defined in render) - text on rect on Y axis with value
    select('.highlightXText')
      .attr('visibility', 'hidden')
      .attr('text-anchor', 'middle')
      .style('font-size', '0.7rem')
      .attr('dy', 2.5)
      .attr('x', -28.5 + margin.left)
      .attr('y', height - margin.bottom - 8);

    select('.highlightXRect')
      .attr('visibility', 'hidden')
      .attr('stroke', 0)
      .attr('fill', theme.colors.highlightYellow)
      .attr('x', margin.left)
      .attr('y', height - margin.top - margin.bottom)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', 57)
      .attr('height', 25)
      .attr('transform', 'translate(-28.5,0)');

    //mouseDot (defined in render)
    select('.mouseDot')
      .attr('visibility', 'hidden')
      .attr('fill', theme.colors.textPrimary)
      .attr('stroke', theme.colors.bgNormal)
      .attr('stroke-width', 3)
      .attr('transform', 'translate(' + xScale(data[0][x_var]) + ',' + yScale(data[0][y_var]) + ')')
      .attr('r', 4)
      .style('cursor', 'crosshair');

    //data dependents
    //background baseLine - all values
    var baseline = svgContent
      .select('.baselineGroup')
      .selectAll('.baseLine')
      .data([data])
      .join('path')
      .attr('class', 'baseLine')
      .attr('stroke', `${theme.colors.bgHighlight}`)
      .attr('stroke-width', '0.16rem')
      .attr('fill', 'none')
      .attr('d', lineGenerator)
      .style('cursor', 'crosshair');

    const pathLength = baseline.node().getTotalLength();

    svgContent
      .select('.highlightLineGroup')
      .selectAll('.linePathInvisible')
      .data([])
      .join('path')
      .attr('class', 'linePathInvisible')
      .attr('stroke', 'none')
      .attr('fill', 'none');

    //highlight line - defaults to not visible
    svgContent
      .select('.highlightLineGroup')
      .selectAll('.linePath')
      .data([data])
      .join('path')
      .attr('class', 'linePath')
      .attr('stroke', 'url(#' + lineGradient + ')')
      .attr('stroke-dasharray', pathLength + ' ' + pathLength)
      .attr('stroke-dashoffset', pathLength)
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('d', lineGenerator);

    //hide axis paths (horizontal lines)
    select('.x-axis path').style('display', 'none');
    select('.x-axis1 path').style('display', 'none');
    // x axis grid height
    const gridXlinesSize = height - margin.top - margin.bottom - 10;
    // x axis with text
    const xAxis = axisBottom(xScale)
      .tickSize('15')
      .ticks(x_ticks)
      .tickFormat(d => timeFormat(x_format)(d))
      .tickSizeInner(-gridXlinesSize);

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

    xComplex.selectAll('.tick line').style('color', `${theme.colors.bgNormal}`).style('cursor', 'crosshair');

    //x Axis minor - copied from BondLineChart
    const xAxis1 = axisBottom(xScale).tickSize('10').ticks(25).tickFormat([]);

    const xComplex1 = svg
      .select('.x-axis1')
      .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
      .style('color', `${theme.colors.bgHighlight}`)
      .call(xAxis1);

    xComplex1.selectAll('.tick line').style('stroke-width', '0.1rem').style('color', `${theme.colors.bgHighlight}`);

    // y Axis and gridlines
    const gridYlinesSize = width - margin.right - margin.left;
    const yAxis = axisLeft(yScale).tickSizeInner(-gridYlinesSize);
    const yComplex = svg
      .select('.y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .style('color', `${theme.colors.bgDarken}`)
      .call(yAxis);

    yComplex.selectAll('.tick text').style('color', `${theme.colors.txtThirdly}`);

    yComplex.selectAll('.tick line').style('color', `${theme.colors.bgNormal}`).style('cursor', 'crosshair');

    //hover rect mouseover functionality.
    // can simplify, move to external function once functionality fixed...
    select('.hover-rect')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', 'transparent')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .style('cursor', 'crosshair')
      .on('mouseover', function (event) {
        //get current index - need to switch to a constant - easier if chart only called when needed
        var mouse_date = xScale.invert(event.offsetX);
        //filter data to current position or less
        var filtered = data.filter(f => f[x_var] <= mouse_date);
        var filtered_last = filtered.length - 1;
        //work out whether left or right is closer
        var left = filtered_last === data.length - 1 ? filtered_last - 1 : filtered_last;
        var right = filtered_last === data.length - 1 ? filtered_last : filtered_last + 1;
        var count_left = timeMinute.count(data[left][x_var], mouse_date);
        var count_right = timeMinute.count(mouse_date, data[right][x_var]);
        if (count_left > count_right && count_right > 0) {
          filtered_last += 1;
        }
        //if the position needs to change
        if (dot_index !== filtered_last) {
          //filter data
          var lowest = Math.min(dot_index, filtered_last);
          var highest = Math.max(dot_index, filtered_last);
          // var difference = highest - lowest;
          // var transitionTime = 500 + 2 * difference;
          var transitionTime = 500;
          var tween_data = data.filter((f, i) => i >= lowest && i <= highest);
          if (dot_index > filtered_last) {
            //moving backwards - flip data and set highest to lowest
            tween_data = tween_data.sort((a, b) => descending(a[x_var], b[x_var]));
            highest = lowest;
          }
          dot_index = filtered_last;
          //create invisible path for mouseDot tween
          const tweenPath = svgContent
            .selectAll('.tweenPath')
            .data([tween_data])
            .join('path')
            .attr('class', 'tweenPath')
            .attr('fill', 'none')
            .attr('d', lineGenerator);

          //interpolate circle along path
          var length = tweenPath.node().getTotalLength();
          var interpolator = interpolate(0, length);
          select('.mouseDot')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attrTween('transform', function () {
              return function (t) {
                var point = tweenPath.node().getPointAtLength(interpolator(t));
                return 'translate(' + point.x + ',' + point.y + ')';
              };
            });

          //move other items
          var pathInvisible = svgContent
            .selectAll('.linePathInvisible')
            .data([data.filter((f, i) => i <= highest)])
            .join('path')
            .attr('class', 'linePathInvisible')
            .attr('stroke', 'none')
            .attr('fill', 'none')
            .attr('d', lineGenerator);

          const pathInvisibleLength = pathInvisible.node().getTotalLength();

          select('.linePath')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('stroke-dashoffset', pathLength - pathInvisibleLength)
            .style('cursor', 'crosshair');

          select('.highlightRect')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('x', -24 + xScale(data[highest][x_var]));

          select('.highlightYText')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('y', yScale(data[highest][y_var]))
            .text(numberFormat(data[highest][y_var]));

          select('.highlightXText')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('x', xScale(data[highest][x_var]))
            .text(timeFormat(x_format)(data[highest][x_var]));

          select('.highlightYRect')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('y', yScale(data[highest][y_var]));

          select('.highlightYLine')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('y1', yScale(data[highest][y_var]))
            .attr('y2', yScale(data[highest][y_var]));

          select('.highlightXRect')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('x', xScale(data[highest][x_var]));

          select('.highlightXLine')
            .attr('visibility', 'visible')
            .interrupt()
            .transition()
            .duration(transitionTime)
            .attr('x1', xScale(data[highest][x_var]))
            .attr('x2', xScale(data[highest][x_var]));
        }
      });
  }

  return (
    <div ref={wrapperRef} style={{ marginTop: '1rem', height: '400px' }} data-testid="historical-line-chart">
      <StyledSVG ref={svgRef} data-testid="historical-line-chart-svg">
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width="100%" height="100%" />
          </clipPath>
        </defs>
        <rect className="hover-rect" />
        <g className="y-axis" />
        <g className="x-axis1" />
        <g className="x-axis" />
        <g className="content" clipPath={`url(#${id})`}>
          <linearGradient id={lineGradient} />
          <g className="baselineGroup" />
          <rect className="highlightRect" />
          <line className="highlightXLine" />
          <line className="highlightYLine" />
          <rect className="highlightYRect" />
          <rect className="highlightXRect" />
          <text className="highlightYText" />
          <text className="highlightXText" />
          <g className="highlightLineGroup" />
          <circle className="mouseDot" />
        </g>
      </StyledSVG>
    </div>
  );
});

export default LineChart;
