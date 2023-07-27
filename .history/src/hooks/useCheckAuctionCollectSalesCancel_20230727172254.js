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
            }));

            const expiredAuctions = await Promise.all(auctions.map(async (listing) => {
                const currentAuctionStatus = await marketplaceContract.getAuctionStatus(listing.listingId)
                if (currentAuctionStatus === 3) {
                    return listing.listingId;
                }
            }));

            const wonAuctions = await Promise.all(auctions.map(async (listing) => {
                const currentAuctionStatus = await marketplaceContract.getAuctionStatus(listing.listingId)
                if (currentAuctionStatus === 4) {
                    return listing.listingId;
                }
            }));

            const usersActiveSales = await Promise.all(activeSales.map(async (listing) => {
                const currentListing = await marketplaceContract.getListing(listing)
                if (currentListing.owner === userWalletAddress) {
                    return listing;
                }
            }));

            const usersExpiredAuctions = await Promise.all(expiredAuctions.map(async (listing) => {
                const currentAuction = await marketplaceContract.getAuction(listing)
                if (currentAuction.owner === userWalletAddress) {
                    return listing;
                }
            }));

            const usersWonAuctions = await Promise.all(wonAuctions.map(async (listing) => {
                const currentAuction = await marketplaceContract.getAuction(listing)
                if (currentAuction.topBidder === userWalletAddress) {
                    return listing;
                }
            }
        }
        checkAuctionCollectSalesCancel();
    }, []);

}