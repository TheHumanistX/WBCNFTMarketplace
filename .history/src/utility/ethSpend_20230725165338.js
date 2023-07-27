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
            const transactionResponse = await marketplaceContract.buyETHNFT(listingID, { value: listingPrice });
            const transactionReceipt = await transactionResponse.wait();
            if (transactionReceipt.status === 1) {
                console.info("Contract call successs", transactionReceipt);
                setTxConfirm(transactionReceipt.blockHash);
            } else {
                console.error("Transaction failed");
            }
        } catch (err) {
            throw err;
        }

    }
    if (path === '/view_auctions') {

        try {

        } catch (err) {
            throw err;
        }

    }

}