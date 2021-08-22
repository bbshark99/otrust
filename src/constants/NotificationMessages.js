export const NOTIFICATION_MESSAGES = {
  error: {
    insufficientFunds: 'Insufficient wNOM balance',
    successBridgeTransaction: 'Your transaction is completed, check your Onomy address balance',
    incorrectOnomyAddressFormat: 'Onomy wallet address format is not correct',
    incorrectAmountFormat: 'wNOM amount format is not correct',
    rejectedTransaction: 'Your transaction is rejected',
    failedTransaction: 'Your transaction failed',
    lowBid: `You have entered insufficient amount to cover gas fee. Since the commission is already included to the specified amount, please increase amount to execute transaction.`,
  },
  success: {
    approvedBridgeTokens: amount => `Transaction Completed! ${amount} wNOM approved to swap.`,
  },
};
