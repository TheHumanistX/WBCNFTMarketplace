import { useEffect } from "react"

export const useCheckAuctionCollectSalesCancel = async (marketplaceContract, userWalletAddress) => {
    useEffect(() => {
        const checkAuctionCollectSalesCancel = async () => {
            let lastListingId = await marketplaceContract.idCounter();
            lastListingId = lastListingId.toNumber();

            const listingData = await Promise.all(
                Array.from({ length: lastListingId }, (_, i) => i).map(async (listingId) => {
                    const listingType = await marketplaceContract.getItemType(listingId)
                    return {
                        listingId: listingId,
                        listingType: listingType
                    };
                })
            );
            const sales = listingData.filter(listing => listing.listingType === 1);
            const auctions = listingData.filter(listing => listing.listingType === 2);

            const activeSales = await Promise.all(sales.map(async (listing) => {
                const currentListingStatus = await marketplaceContract.getListingStatus(listing.listingId)
                if (currentListingStatus === 1) {
                    return listing.listingId;
                }
            }
        }
        checkAuctionCollectSalesCancel();
    }, []);

}