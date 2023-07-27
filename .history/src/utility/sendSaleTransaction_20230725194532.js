export const sendSaleTransaction = async (createTransactionCallback, ...args) => {
    try {
        const transactionResponse = await createTransactionCallback(...args);
        const transactionReceipt = await transactionResponse.wait();
        if (transactionReceipt.status === 1) {
            console.info("Contract call successs", transactionReceipt);
            setTxConfirm(transactionReceipt.blockHash);
        } else {
            console.error("Transaction failed");
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
  }
  