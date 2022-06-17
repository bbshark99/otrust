import { cleanup } from '@testing-library/react';

import { renderWithContext } from 'utils/testing';
import Exchange from './Exchange';

describe('Given an Exchange component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', async () => {
      const { asFragment } = renderWithContext(Exchange);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
