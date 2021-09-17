import { cleanup, fireEvent, render } from '@testing-library/react';

import TransactionFailedModal from './TransactionFailedModal';
import { renderWithContext, ThemeWrapper, ModalContextWrapper } from '../../../utils/testing';

const testProps = {
  error: 'Error message',
};

const testModalContext = {
  handleModal: jest.fn(),
};

describe('Given the TransactionFailedModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(TransactionFailedModal, testProps);
      expect(asFragment()).toMatchSnapshot();
    });

    describe('and user clicks on Modal CloseIcon', () => {
      it('should call handleModal function from Modal Context', async () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(TransactionFailedModal, testProps), testModalContext)
        );

        fireEvent.click(queryByTestId('failed-modal-close-icon'));
        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });

    describe('and user clicks on Modal PrimaryButton', () => {
      it('should call handleModal function from Modal Context', async () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(TransactionFailedModal, testProps), testModalContext)
        );

        fireEvent.click(queryByTestId('failed-modal-primary-button'));
        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });
  });
});
