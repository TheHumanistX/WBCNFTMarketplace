import { useEffect, useState } from "react"
import { useEthers, useMarketplace } from '../context';

export const useCheckAuctionCollectSalesCancel = async ( setDisplayButton) => {

    const { userWalletAddress } = useEthers();
    const { marketplaceContract } = useMarketplace();

    const [activeSales, setActiveSales] = useState([]);
    const [expiredAuctions, setExpiredAuctions] = useState([]);
    const [wonAuctions, setWonAuctions] = useState([]);

    useEffect(() => {
        if(!marketplaceContract) return;
        const checkAuctionCollectSalesCancel = async () => {
            let lastListingId = await marketplaceContract.idCounter();
            lastListingId = lastListingId.toNumber();

            const listingData = await Promise.all(
                // !
                // ! May need to change to `=> i + 1` if having issues with listingIds lining up
                // !
                Array.from({ length: lastListingId }, (_, i) => i).map(async (listingId) => {
                    const listingType = await marketplaceContract.getItemType(listingId)
                    return {
                        listingId: listingId,
                        listingType: listingType
                    };
                })
            );

            const usersActiveSales = [];
            const usersExpiredAuctions = [];
            const usersWonAuctions = [];

            for (const listing of listingData) {
                let currentStatus;
                let currentOwner;

                if (listing.listingType === 1) { // sale
                    currentStatus = await marketplaceContract.getListingStatus(listing.listingId);
                    currentOwner = (await marketplaceContract.getListing(listing.listingId)).owner;
                } else if (listing.listingType === 2) { // auction
                    currentStatus = await marketplaceContract.getAuctionStatus(listing.listingId);
                    currentOwner = (await marketplaceContract.getAuction(listing.listingId)).owner;
                }

                if (currentOwner === userWalletAddress) {
                    if (listing.listingType === 1 && currentStatus === 1) {
                        usersActiveSales.push(listing.listingId);
                    } else if (listing.listingType === 2 && currentStatus === 3) {
                        usersExpiredAuctions.push(listing.listingId);
                    }
                } else if (currentStatus === 4 && (await marketplaceContract.getAuction(listing.listingId)).topBidder === userWalletAddress) {
                    usersWonAuctions.push(listing.listingId);
                }
            }

            setActiveSales(usersActiveSales);
            console.log('usersActiveSales: ', usersActiveSales)
            setExpiredAuctions(usersExpiredAuctions);
            console.log('usersExpiredAuctions: ', usersExpiredAuctions)
            setWonAuctions(usersWonAuctions);
            console.log('usersWonAuctions: ', usersWonAuctions)
            setDisplayButton(usersActiveSales.length > 0 || usersExpiredAuctions.length > 0 || usersWonAuctions.length > 0);
        }
        checkAuctionCollectSalesCancel();
    }, [marketplaceContract, userWalletAddress]);

    return {
        activeSales,
        expiredAuctions,
        wonAuctions
    };
}
