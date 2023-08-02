import { sendTransaction } from "../utility";

export const tokenSpend = async ({
  auctionID,
  listingID,
  weiBidAmount,
  marketplaceContract,
  setTxConfirm,
  path,
  approval
}) => {

  console.log('Buying with ERC20...')

  if (path === '/buy_nft') {

    if (approval && approval.status === 1) {
      try {

        const createTokenTransaction = (contract, listingID) => {
          // Create and return the specific transaction for tokenSpend
          return contract.buyERC20NFT(listingID);
        };

        await sendTransaction(createTokenTransaction, setTxConfirm, marketplaceContract, listingID);

      } catch (err) {
        console.error("contract call failure", err);
        throw err;
      }
    } else {
      console.error("Transaction failed");
    }
  }
  if (path === '/view_auctions') {
    if (approval && approval.status === 1) {
      try {

        const createTokenTransaction = (contract, auctionID, weiBidAmount) => {
          // Create and return the specific transaction for tokenSpend
          return contract.erc20BidAmount(auctionID, weiBidAmount);
        };

        await sendTransaction(createTokenTransaction, setTxConfirm, marketplaceContract, auctionID, weiBidAmount);
      } catch (err) {
        console.error('Failed to bid with WBC', err);
        throw err;
      }
    } else {
      console.error("Transaction failed");
    }
  }
}