import { ethers } from 'ethers';

export const createNewAuction = async (
    listingCurrency,
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

    if (listingCurrency == 'ETH') {

        if (approval && approval.status === 1) {
            try {
                const createAuctionSigWithETH = 'createAuction(address,uint256,uint256,uint256,uint256,uint256)';
                const transactionResponse = await marketplaceContract.functions[createAuctionSigWithETH](
                    nftContractAddress,
                    tokenId,
                    initBidInWei,
                    bidIncrementInWei,
                    beginTimestamp,
                    expirationTimestamp
                );

                const transactionReceipt = await transactionResponse.wait();
                if (transactionReceipt.status === 1) {
                    console.info("New auction creation successs", transactionReceipt);
                    setTxConfirm(transactionReceipt.blockHash);
                    // return transactionReceipt;
                } else {
                    console.error("Transaction failed");
                }
            } catch (err) {
                throw err;
            }
        }

    } else {

        if (approval && approval.status === 1) {
            try {
                const createAuctionSigWithToken = 'createAuction(address,uint256,address,uint256,uint256,uint256,uint256)';
                const transactionResponse = await marketplaceContract.functions[createAuctionSigWithToken](
                    nftContractAddress,
                    tokenId,
                    tokenContractAddress,
                    initBidInWei,
                    bidIncrementInWei,
                    beginTimestamp,
                    expirationTimestamp
                );
                const transactionReceipt = await transactionResponse.wait();
                if (transactionReceipt.status === 1) {
                    console.info("New auction creation successs", transactionReceipt);
                    setTxConfirm(transactionReceipt.blockHash);
                    // return transactionReceipt;
                } else {
                    console.error("Transaction failed");
                }
            } catch (err) {
                throw err;
            }
        }
    }

}