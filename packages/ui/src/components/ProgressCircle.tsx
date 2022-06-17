import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import { select, arc } from 'd3';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

export default function ProgressCircle({
  percent,
  message = '',
}: {
  percent: number;
  message?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const startTime = useMemo(() => new Date().getTime(), []);
  const estimatedMinutes = useMemo(() => {
    const now = new Date().getTime();
    const elapsed = now - startTime;
    const speed = percent / elapsed;
    const remaining = 100 - percent;
    if (remaining === 0) return null;
    const time = remaining / speed;
    return Math.round(time / 60000) || null;
  }, [percent, startTime]);

  useEffect(() => {
    const svg = select(svgRef.current);

    const generatedArc = arc()
      .innerRadius(46)
      .outerRadius(49)
      .startAngle(0)
      .endAngle((2 * Math.PI * percent) / 100)
      .cornerRadius(4);

    svg
      .append('path')
      // @ts-ignore
      .attr('d', generatedArc())
      .style('transform', 'translate(50px, 50px)')
      .style('fill', '#fff');
  }, [percent]);

  return (
    <Wrapper>
      <svg width="100" height="100" ref={svgRef}>
        <circle cx="50" cy="50" r="47" stroke="#302e3d" strokeWidth="3" fill="none" />
      </svg>

      <Label>
        {message}{' '}
        {estimatedMinutes && (
          <>
            {Math.max(estimatedMinutes, 1)} minute{estimatedMinutes === 1 ? '' : 's'} left
          </>
        )}
      </Label>
    </Wrapper>
  );
}
