import { sendTransaction } from "../utility";

export const ethSpend = async ({
    auctionID,
    listingID,
    weiBidAmount,
    value,
    marketplaceContract,
    setTxConfirm,
    path
}) => {

    console.log('Buying with ETH...')
    if (path === '/buy_nft') {
        console.log('Entered ethSpend... path is buy_nft... listingID: ', listingID, ' value: ', value, ' setTxConfirm: ', setTxConfirm, ' path: ', path)
        try {
            
            const createEthTransaction = (contract, listingID, value) => {
                // Create and return the specific transaction for ethSpend
                return contract.buyETHNFT(listingID, { value: value });
              };
              
              await sendTransaction(createEthTransaction, setTxConfirm, marketplaceContract, listingID, value);
         
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