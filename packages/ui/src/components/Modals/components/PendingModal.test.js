import { cleanup } from '@testing-library/react';

import PendingModal from './PendingModal';
import { renderWithContext } from '../../../utils/testing';

describe('Given the PendingModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(PendingModal);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
