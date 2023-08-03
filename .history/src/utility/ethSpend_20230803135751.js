import { sendTransaction } from "../utility";

export const ethSpend = async ({
    listingID,
    value,
    marketplaceContract,
    setTxConfirm,
    path
}) => {

    console.log('Buying with ETH...')
    if (path === '/buy_nft') {
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
            const createEthTransaction = (contract, listingID, value) => {
                return contract.ethBidAmount(listingID, { value: value });
            }

            await sendTransaction(createEthTransaction, setTxConfirm, marketplaceContract, listingID, value);
            
        } catch (err) {
            throw err;
        }

    }

}