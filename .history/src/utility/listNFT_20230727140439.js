export const listNFT = async (path, setTxConfirm, marketplaceContract, nftContract, tokenId, price, userWalletAddress) => {
    if (saleCurrency === 'ETH') {
        try {

        } catch (err) {
            throw err;
        }
    } else {
        try {
            const transactionResponse = await marketplaceContract.createAuction(nftContractAddress, tokenId, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp);
            const transactionReceipt = await transactionResponse.wait();
            console.info("contract call successs", transactionReceipt);
            if (transactionReceipt.status === 1) {
                console.info("contract call successs", transactionReceipt);
                setTxConfirm(transactionReceipt.blockHash);
            } else {
                console.error("Transaction failed");
            }
        } catch (err) {
            throw err;
        }
    }
}