import react, { useEffect, useState } from 'react';

export const useUsersActiveListings = ( marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents ) => {
    const [usersActiveListings, setUsersActiveListings] = useState([]);
    
    useEffect(() => {
        if (!marketplaceContract || !userWalletAddress || !marketplaceNFTListedEvents || !marketplaceAuctionCreatedEvents) {
            return;
        }
        const fetchUserActiveListings = async () => {
            const listedIDs = marketplaceNFTListedEvents.map(event => event.listingID);
            const auctionIDs = marketplaceAuctionCreatedEvents.map(event => event.listingID);
            const allIDs = [...listedIDs, ...auctionIDs];
            const userActiveListings = [];

            for (let id of allIDs) {
                try {
                    const listingType = await marketplaceContract.call('getItemType', [id]);

                    let listingDetails;
                    switch (listingType) {
                        case 'LISTING':
                            listingDetails = await marketplaceContract.call('getListing', [id]);
                            break;
                        case 'AUCTION':
                            listingDetails = await marketplaceContract.call('getAuction', [id]);
                            break;
                        default:
                            throw new Error('Unexpected item type');
                    }

                    if (listingDetails.status === 'ACTIVE' && listingDetails.owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                        userActiveListings.push(listingDetails);
                    }
                } catch (error) {
                    console.error(`Error fetching details for listing ID ${id}: ${error.message}`);
                }
            }

            setUsersActiveListings(userActiveListings);
        };

        fetchUserActiveListings();
    }, [marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents]);

    return usersActiveListings;
    
}
