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

    if (path === '/buy_nft') {

        try {
            console.log('Buying with ETH...')
            // const transactionResponse = await marketplaceContract.buyETHNFT(listingID, { value: listingPrice });
            // const transactionReceipt = await transactionResponse.wait();
            
            const createEthTransaction = (contract, listingID, listingPrice) => {
                // Create and return the specific transaction for ethSpend
                return contract.buyETHNFT(listingID, { value: listingPrice });
              };
              
              await sendTransaction(createEthTransaction, setTxConfirm, marketplaceContract, listingID, listingPrice);
              

            // if (transactionReceipt.status === 1) {
            //     console.info("Contract call successs", transactionReceipt);
            //     setTxConfirm(transactionReceipt.blockHash);
            // } else {
            //     console.error("Transaction failed");
            // }
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