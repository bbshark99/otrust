export const NOTIFICATION_MESSAGES = {
  error: {
    insufficientFunds: 'Insufficient bNOM balance',
    successBridgeTransaction: 'Your transaction is completed, check your Onomy address balance',
    incorrectOnomyAddressFormat: 'Onomy Wallet address format is not correct',
    incorrectAmountFormat: 'bNOM amount format is not correct',
    rejectedTransaction: 'Your transaction is rejected',
    failedTransaction: 'Your transaction failed',
    lowBid: `Your purchase amount must be more than the cumulative transaction and gas fee.  Please increase your purchase amount to successfully submit your transaction.`,
  },
  success: {
    approvedBridgeTokens: amount => `Transaction Completed! ${amount} bNOM approved to bridge.`,
  },
};
