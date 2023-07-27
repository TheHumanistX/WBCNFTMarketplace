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

console.log('Entered tokenSpend function...')
console.log('tokenSpend auctionID:', auctionID)
console.log('tokenSpend listingID:', listingID)
console.log('tokenSpend weiBidAmount:', weiBidAmount)
console.log('tokenSpend marketplaceContract:', marketplaceContract)
console.log('tokenSpend path:', path)
  if (path === '/buy_nft') {
    console.log('Entered buy_nft if statement in tokenSpend function...')
    if (approval && approval.status === 1) {
      try {
        console.log('Buying with ERC20...')
        // const transactionResponse = await marketplaceContract.buyERC20NFT(listingID);
        // const transactionReceipt = await transactionResponse.wait();
        
        const createTokenTransaction = (contract, listingID) => {
          // Create and return the specific transaction for tokenSpend
          return contract.buyERC20NFT(listingID);
        };
        
        await sendTransaction(createTokenTransaction, setTxConfirm, marketplaceContract, listingID);      
  
      } catch (err) {
        console.error("contract call failure", err);
        throw err;
      }
    }
  }
  if (path === '/view_auctions') {
    if (approval && approval.status === 1) {
      try {
        console.log('Bidding with WBC...')
        console.log('bidWithWBC auctionID: ', auctionID)
        console.log('bidWithWBC weiBidAmount: ', weiBidAmount)
  
        const createTokenTransaction = (contract, auctionID, weiBidAmount) => {
          // Create and return the specific transaction for tokenSpend
          return contract.erc20BidAmount(auctionID, weiBidAmount);
        };
        
        await sendTransaction(createTokenTransaction, setTxConfirm, marketplaceContract, auctionID, weiBidAmount);      
      } catch (error) {
        console.error('Failed to bid with WBC', error);
        throw error;
      }
    }
  }
}