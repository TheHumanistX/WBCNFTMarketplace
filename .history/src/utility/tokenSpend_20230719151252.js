export const tokenSpend = async (auctionID, weiBidAmount, marketplaceContract, setBidSuccessfulSwitch, bidSuccessfulSwitch, setTxConfirm) => {
    try {
        console.log('Bidding with WBC...')
        console.log('bidWithWBC auctionID: ', auctionID)
        console.log('bidWithWBC weiBidAmount: ', weiBidAmount)

        const transaction = await marketplaceContract.call('erc20BidAmount', [auctionID, weiBidAmount]);
        if (transaction.receipt.status === 1) {
          console.info("contract call successs", transaction);
          setTxConfirm(transaction.receipt.blockHash);
          console.log('Bid placed with WBC!');
          setBidSuccessfulSwitch(!bidSuccessfulSwitch);
        } else {
          console.error("Transaction failed");
        }
      } catch (error) {
        console.error('Failed to bid with WBC', error);
      }
}