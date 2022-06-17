import { cleanup, fireEvent, render } from '@testing-library/react';

import RequestFailedModal from './RequestFailedModal';
import { ThemeWrapper, ModalContextWrapper, renderWithContext } from '../../../utils/testing';

const testProps = {
  error: 'Error message',
};

const testModalContext = {
  handleModal: jest.fn(),
};

describe('Given the RequestFailedModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(RequestFailedModal, testProps);
      expect(asFragment()).toMatchSnapshot();
    });

    describe('and user clicks on CloseIcon', () => {
      it('should call handleModal from the useModal context', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(RequestFailedModal, testProps), testModalContext)
        );
        fireEvent.click(queryByTestId('request-failed-close-icon'));

        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });

    describe('and user clicks on PrimaryButton', () => {
      it('should call handleModal from the useModal context', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(RequestFailedModal, testProps), testModalContext)
        );
        fireEvent.click(queryByTestId('request-failed-primary-button'));

        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });
  });
});
