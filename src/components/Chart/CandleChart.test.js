import { cleanup } from '@testing-library/react';

import CandleChart from './CandleChart';
import { renderWithContext } from '../../utils/testing';

describe('Given the CandleChart component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(CandleChart);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
