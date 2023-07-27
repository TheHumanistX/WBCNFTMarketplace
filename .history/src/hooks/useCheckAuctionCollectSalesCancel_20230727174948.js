// import { useEffect, useState } from "react"

// export const useCheckAuctionCollectSalesCancel = async (marketplaceContract, userWalletAddress, setDisplayAuctionSaleManagement) => {

//     const [activeSales, setActiveSales] = useState([]);
//     const [expiredAuctions, setExpiredAuctions] = useState([]);
//     const [wonAuctions, setWonAuctions] = useState([]);

//     useEffect(() => {
//         const checkAuctionCollectSalesCancel = async () => {
//             let lastListingId = await marketplaceContract.idCounter();
//             lastListingId = lastListingId.toNumber();

//             const listingData = await Promise.all(
//                 Array.from({ length: lastListingId }, (_, i) => i).map(async (listingId) => {
//                     const listingType = await marketplaceContract.getItemType(listingId)
//                     return {
//                         listingId: listingId,
//                         listingType: listingType
//                     };
//                 })
//             );
//             const sales = listingData.filter(listing => listing.listingType === 1);
//             const auctions = listingData.filter(listing => listing.listingType === 2);

//             const activeSales = await Promise.all(sales.map(async (listing) => {
//                 const currentListingStatus = await marketplaceContract.getListingStatus(listing.listingId)
//                 if (currentListingStatus === 1) {
//                     return listing.listingId;
//                 }
//             }));

//             const expiredAuctions = await Promise.all(auctions.map(async (listing) => {
//                 const currentAuctionStatus = await marketplaceContract.getAuctionStatus(listing.listingId)
//                 if (currentAuctionStatus === 3) {
//                     return listing.listingId;
//                 }
//             }));

//             const wonAuctions = await Promise.all(auctions.map(async (listing) => {
//                 const currentAuctionStatus = await marketplaceContract.getAuctionStatus(listing.listingId)
//                 if (currentAuctionStatus === 4) {
//                     return listing.listingId;
//                 }
//             }));

//             const usersActiveSales = await Promise.all(activeSales.map(async (listing) => {
//                 const currentListing = await marketplaceContract.getListing(listing)
//                 if (currentListing.owner === userWalletAddress) {
//                     return listing;
//                 }
//             }));

//             const usersExpiredAuctions = await Promise.all(expiredAuctions.map(async (listing) => {
//                 const currentAuction = await marketplaceContract.getAuction(listing)
//                 if (currentAuction.owner === userWalletAddress) {
//                     return listing;
//                 }
//             }));

//             const usersWonAuctions = await Promise.all(wonAuctions.map(async (listing) => {
//                 const currentAuction = await marketplaceContract.getAuction(listing)
//                 if (currentAuction.topBidder === userWalletAddress) {
//                     return listing;
//                 }
//             }));

//             // Use built-in Boolean function to filter out undefined values
//             const definedActiveSales = usersActiveSales.filter(Boolean);
//             const definedExpiredAuctions = usersExpiredAuctions.filter(Boolean);
//             const definedWonAuctions = usersWonAuctions.filter(Boolean);

//             if (definedActiveSales.length > 0 || definedExpiredAuctions.length > 0 || definedWonAuctions.length > 0) {
//                 definedActiveSales.length > 0 && setActiveSales(definedActiveSales);
//                 definedExpiredAuctions.length > 0 && setExpiredAuctions(definedExpiredAuctions);
//                 definedWonAuctions.length > 0 && setWonAuctions(definedWonAuctions);
//                 setDisplayAuctionSaleManagement(true);
//             } else {
//                 setDisplayAuctionSaleManagement(false);
//             }
//         }
//         checkAuctionCollectSalesCancel();
//     }, []);

//     return {
//         activeSales,
//         expiredAuctions,
//         wonAuctions
//     };

// }

import { useEffect, useState } from "react"

export const useCheckAuctionCollectSalesCancel = async (marketplaceContract, userWalletAddress, setDisplayAuctionSaleManagement) => {

    const [activeSales, setActiveSales] = useState([]);
    const [expiredAuctions, setExpiredAuctions] = useState([]);
    const [wonAuctions, setWonAuctions] = useState([]);

    useEffect(() => {
        const checkAuctionCollectSalesCancel = async () => {
            let lastListingId = await marketplaceContract.idCounter();
            lastListingId = lastListingId.toNumber();

            const listingData = await Promise.all(
                Array.from({ length: lastListingId }, (_, i) => i + 1).map(async (listingId) => {
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
            setExpiredAuctions(usersExpiredAuctions);
            setWonAuctions(usersWonAuctions);
            setDisplayAuctionSaleManagement(usersActiveSales.length > 0 || usersExpiredAuctions.length > 0 || usersWonAuctions.length > 0);
        }
        checkAuctionCollectSalesCancel();
    }, [marketplaceContract, userWalletAddress]);

    return {
        activeSales,
        expiredAuctions,
        wonAuctions
    };
}
