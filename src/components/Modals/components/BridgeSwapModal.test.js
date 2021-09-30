import { cleanup } from '@testing-library/react';
import { BigNumber } from 'bignumber.js';

import { initialGasOptions, initialErrorsState } from './BridgeSwapMain';
import BridgeSwapModal from './BridgeSwapModal';
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

describe('Given the BridgeSwapModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(BridgeSwapModal, testProps);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
