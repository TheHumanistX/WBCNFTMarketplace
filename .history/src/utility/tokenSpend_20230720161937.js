

export const tokenSpend = async (
  auctionID,
  listingID,
  weiBidAmount,
  marketplaceContract,
  setBidSuccessfulSwitch,
  bidSuccessfulSwitch,
  setTxConfirm,
  path
) => {



  if (path === '/buy_nft') {
    try {
      console.log('Buying with ERC20...')
      const transactionResponse = await marketplaceContract.buyERC20NFT(listingID);
      const transactionReceipt = await transactionResponse.wait();
      if (transactionReceipt.status === 1) {
        console.info("Contract call successs", transactionReceipt);
        setTxConfirm(transactionReceipt.blockHash);
      } else {
        console.error("Transaction failed");
      }
    } catch (err) {
      console.error("contract call failure", err);
      throw err;
    }
  }
  if (path === '/view_auctions') {
    try {
      console.log('Bidding with WBC...')
      console.log('bidWithWBC auctionID: ', auctionID)
      console.log('bidWithWBC weiBidAmount: ', weiBidAmount)

      const transactionResponse = await marketplaceContract.call('erc20BidAmount', [auctionID, weiBidAmount]);
      const transactionReceipt = await transactionResponse.wait();
      if (transactionReceipt.status === 1) {
        console.info("Contract call successs", transactionReceipt);
        setTxConfirm(transactionReceipt.blockHash);
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