
export const createNewListing = async (
    approval,
    setTxConfirm,
    marketplaceContract,
    nftContractAddress,
    tokenContractAddress,
    tokenId,
    priceInWei,
    listingCurrency
) => {
    if (listingCurrency === 'ETH') {
        // convert price to wei
        if (approval && approval.status === 1) {
            try {
                await listNFT({
                    approval,
                    setTxConfirm,
                    marketplaceContract,
                    nftContractAddress,
                    tokenId,
                    priceInWei,
                    listingCurrency
                });
            } catch (err) {
                console.error("contract call failure", err);
            }
        }
    } else {
        if (approval && approval.status === 1) {
            try {
                await listNFT({
                    approval,
                    setTxConfirm,
                    marketplaceContract,
                    nftContractAddress,
                    tokenContractAddress,
                    tokenId,
                    priceInWei,
                    listingCurrency
                });
            } catch (err) {
                console.error("contract call failure", err);
            }
        }
    }
}