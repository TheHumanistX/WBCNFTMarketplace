export const createNewAuction = async (saleCurrency, 
    approval, 
    setTxConfirm, 
    marketplaceContract, 
    nftContractAddress, 
    tokenId, 
    tokenContractAddress,
    initBidInWei, 
    bidIncrementInWei, 
    beginTimestamp, 
    expirationTimestamp
    ) => {

    if (saleCurrency == 'ETH') {

        if (approval && approval.status === 1) {
            try {
                const transactionResponse = await marketplaceContract.createAuction(
                    nftContractAddress, 
                    tokenId, 
                    initBidInWei, 
                    bidIncrementInWei, 
                    beginTimestamp, 
                    expirationTimestamp
                    );
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

    } else {

        if (approval && approval.receipt.status === 1) {
            try {
                const createListingSigWithToken = 'createListing(address,address,uint256,uint256)';
                const transactionResponse = await marketplaceContract.functions[createListingSigWithToken](
                    nftContractAddress, 
                    tokenId, 
                    tokenContractAddress, 
                    initBidInWei, 
                    bidIncrementInWei, 
                    beginTimestamp, 
                    expirationTimestamp
                    );
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

}