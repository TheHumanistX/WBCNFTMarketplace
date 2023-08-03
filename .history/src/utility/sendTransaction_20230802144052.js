export const sendTransaction = async (createTransactionCallback, setTxConfirm, ...args) => {
    try {
        console.log('STEP 7: Entered sendTransaction() in sendTransaction.js... begin transaction...')
        const transactionResponse = await createTransactionCallback(...args);
        console.log('STEP 9: Transaction sent, waiting for confirmation back in sendTransaction()...)
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
  