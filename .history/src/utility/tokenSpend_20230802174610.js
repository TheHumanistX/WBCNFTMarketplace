import { sendTransaction } from "../utility";

export const tokenSpend = async ({
  listingID,
  value,
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
    console.log('STEP 5: Entered tokenSpend() with path===/view_auctions...')
    if (approval && approval.status === 1) {
      try {
        const createTokenTransaction = (contract, listingID, value) => {
          // Create and return the specific transaction for tokenSpend
          console.log('STEP 8: Entered createTokenTransaction() in tokenSpend()... This was the fallback function in sendTransaction()...')
          return contract.erc20BidAmount(listingID, value);
        };
        
        console.log('STEP 6: approval passed, calling sendTransaction in tokenSpend()...')
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