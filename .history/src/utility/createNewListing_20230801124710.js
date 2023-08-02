
export const createNewListing = async (

) => {
    if (listingCurrency === 'ETH') {
        // convert price to wei

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
      } else {
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