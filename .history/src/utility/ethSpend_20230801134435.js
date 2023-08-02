import { sendTransaction } from "../utility";

export const ethSpend = async ({
    auctionID,
    listingID,
    weiBidAmount,
    listingPrice,
    marketplaceContract,
    setTxConfirm,
    path
}) => {

    console.log('Buying with ETH...')
    if (path === '/buy_nft') {

        try {
            
            const createEthTransaction = (contract, listingID, listingPrice) => {
                // Create and return the specific transaction for ethSpend
                return contract.buyETHNFT(listingID, { value: listingPrice });
              };
              
              await sendTransaction(createEthTransaction, setTxConfirm, marketplaceContract, listingID, listingPrice);
         
        } catch (err) {
            throw err;
        }

    }
    
    if (path === '/view_auctions') {

        try {
            const createEthTransaction = (contract, auctionID, weiBidAmount) => {
                return contract.ethBidAmount(auctionID, { value: weiBidAmount });
            }

            await sendTransaction(createEthTransaction, setTxConfirm, marketplaceContract, auctionID, weiBidAmount);
            
        } catch (err) {
            throw err;
        }

    }

}