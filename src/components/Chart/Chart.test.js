import { cleanup } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { renderWithContext } from '../../utils/testing';
import Chart from './Chart';

jest.mock('react-responsive');

describe('Given the Chart component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);
    beforeEach(() => {
      useMediaQuery.mockImplementation(() => true);
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(Chart);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should have three tabs of charts', () => {
      const { getByText } = renderWithContext(Chart);
      expect(getByText('Bonding Curve Chart')).toBeInTheDocument();
      expect(getByText('Trading View')).toBeInTheDocument();
    });

    it('should have default opened bondLineChart chart', () => {
      const { queryByTestId } = renderWithContext(Chart);
      expect(queryByTestId('bond-line-chart')).toBeInTheDocument();
      expect(queryByTestId('candle-chart')).not.toBeInTheDocument();
      expect(queryByTestId('historical-line-chart')).not.toBeInTheDocument();
    });
  });
});
