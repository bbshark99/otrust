import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import ApproveModal from './ApproveModal';
import { ThemeWrapper, ModalContextWrapper, renderWithContext } from '../../../utils/testing';

const testProps = {
  onApprove: jest.fn(),
};

const testModalContext = {
  handleModal: jest.fn(),
};

describe('Given the ApproveModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(ApproveModal, testProps);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should not call handleModal from the useModal context', async () => {
      render(ModalContextWrapper(ThemeWrapper(ApproveModal, testProps), testModalContext));

      await waitFor(() => expect(testModalContext.handleModal).not.toHaveBeenCalled());
    });

    describe('and user clicks on CloseIcon', () => {
      it('should call handleModal from the useModal context', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(ApproveModal, testProps), testModalContext)
        );
        fireEvent.click(queryByTestId('approve-modal-close-icon'));

        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });

    describe('and user clicks on SecondaryButton', () => {
      it('should call handleModal from the useModal context', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(ApproveModal, testProps), testModalContext)
        );
        fireEvent.click(queryByTestId('approve-modal-secondary-button'));

        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });

    describe('and user clicks on PrimaryButton', () => {
      it('should call onApprove from the props', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(ApproveModal, testProps), testModalContext)
        );
        fireEvent.click(queryByTestId('approve-modal-primary-button'));

        expect(testProps.onApprove).toHaveBeenCalled();
      });
    });
  });
});
