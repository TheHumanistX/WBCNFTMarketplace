export const sendSaleTransaction = async (createTransactionCallback, ...args) => {
    try {
        const transactionResponse = await createTransactionCallback(...args);
        const transactionReceipt = await transactionResponse.wait();
        return transactionReceipt;
      } catch (error) {
        console.error(error);
        throw error;
      }
  }
  