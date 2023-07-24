export const useBidWithWBC = async ({bidAmount, auctionID}) => {
    if (parseFloat(bidAmount) <= 0) {
        console.log('Bid amount must be greater than zero');
        return;
      }
      let approval;
      const weiBidAmount = ethers.utils.parseEther(bidAmount);
      try {
        approval = await approve({ args: [marketplaceContractAddress, weiBidAmount] });
        console.log("wbc amount approval success", approval);
      } catch (error) {
        console.log("wbc amount approval failure", error);
      }
  
      if (approval && approval.receipt.status === 1) {
        try {
          console.log('Bidding with WBC...')
          console.log('bidWithWBC auctionID: ', auctionID)
          console.log('bidWithWBC bidAmount: ', bidAmount)
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
}