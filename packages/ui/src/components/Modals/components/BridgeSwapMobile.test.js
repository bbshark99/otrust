import { cleanup } from '@testing-library/react';
import ReactModal from 'react-modal';
import { BigNumber } from 'bignumber.js';

import { initialGasOptions, initialErrorsState } from './BridgeSwapMain';
import BridgeSwapMobile from './BridgeSwapMobile';
import { renderWithContext } from '../../../utils/testing';

const testProps = {
  values: {
    onomyWalletValue: '',
    amountValue: '',
    formattedWeakBalance: BigNumber(0),
    allowanceAmountGravity: BigNumber(0),
    weakBalance: BigNumber(0),
    errors: initialErrorsState,
    gasPrice: 0,
    gasPriceChoice: '',
    gasOptions: initialGasOptions,
  },
  flags: {
    isDisabled: false,
    isTransactionPending: false,
    showBridgeExchangeModal: true,
    showApproveModal: false,
    showTransactionCompleted: false,
    showLoader: false,
  },
  handlers: {
    walletChangeHandler: jest.fn(),
    amountChangeHandler: jest.fn(),
    maxBtnClickHandler: jest.fn(),
    submitTransClickHandler: jest.fn(),
    onCancelClickHandler: jest.fn(),
    closeModal: jest.fn(),
    setGasPriceChoice: jest.fn(),
    setGasPrice: jest.fn(),
  },
};

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
ReactModal.setAppElement(modalRoot);
document.body.appendChild(modalRoot);

describe('Given the BridgeSwapMobile component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(BridgeSwapMobile, testProps);
      expect(asFragment()).toMatchSnapshot();
    });

    it.skip('should show swap Modal and do not show info Modal', () => {
      const { queryByTestId } = renderWithContext(BridgeSwapMobile, testProps);
      expect(queryByTestId('bridge-mobile-swap-modal')).toBeInTheDocument();
      expect(queryByTestId('bridge-mobile-info-modal')).not.toBeInTheDocument();
    });
  });
});
