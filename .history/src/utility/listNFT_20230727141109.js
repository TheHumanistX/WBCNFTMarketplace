export const listNFT = async ({setTxConfirm, marketplaceContract, nftContractAddress, tokenContractAddress, tokenId, priceInWei, saleCurrency}) => {
    if (saleCurrency === 'ETH') {
        try {
            if (approval && approval.status === 1) {
                const createListingSigWithETH = 'createListing(address,uint256,uint256)';
                const transactionResponse = await marketplaceContract.functions[createListingSigWithETH](nftContractAddress, tokenId, priceInWei);
                const transactionReceipt = await transactionResponse.wait();
                if (transactionReceipt.status === 1) {
                    console.info("Contract call successs", transactionReceipt);
                    setTxConfirm(transactionReceipt.blockHash);
                } else {
                    console.error("Transaction failed");
                }
            }
        } catch (err) {
            throw err;
        }
    } else {
        try {
            if (approval && approval.status === 1) {
                const createListingSigWithToken = 'createListing(address,address,uint256,uint256)';
                const transactionResponse = await marketplaceContract.functions[createListingSigWithToken](nftContractAddress, tokenContractAddress, tokenId, priceInWei);
                const transactionReceipt = await transactionResponse.wait();
                if (transactionReceipt.status === 1) {
                    console.info("Contract call successs", transactionReceipt);
                    setTxConfirm(transactionReceipt.blockHash);
                } else {
                    console.error("Transaction failed");
                }
            }
        } catch (err) {
            throw err;
        }
    }
}