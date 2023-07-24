import react, { useEffect, useState } from 'react';

export const useUsersActiveListings = ( marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents ) => {
    const [usersActiveListings, setUsersActiveListings] = useState([]);
    
    useEffect(() => {
        if (!marketplaceContract || !userWalletAddress || !marketplaceNFTListedEvents || !marketplaceAuctionCreatedEvents) {
            return;
        }
        const fetchUserActiveListings = async () => {
            console.log('Fetching active listings for wallet address: ', userWalletAddress);
            const listedIDs = marketplaceNFTListedEvents.map(event => event.data.listingID.toNumber());
            // console.log('marketplaceListedEvents: ', marketplaceNFTListedEvents)
            // console.log('Listing IDs: ', listedIDs);
            const auctionIDs = marketplaceAuctionCreatedEvents.map(event => event.data.auctionID.toNumber());
            console.log('marketplaceAuctionCreatedEvents: ', marketplaceAuctionCreatedEvents)
            console.log('Auction IDs: ', auctionIDs)
            const allIDs = [...listedIDs, ...auctionIDs];
            const userActiveListings = [];

            for (let id of allIDs) {
                console.log('type of "id": ', typeof(id))
                try {
                    console.log('Entered try block...')
                    const listingType = await marketplaceContract.call('getItemType', [id]);
                    console.log('listingType: ', listingType)
                    console.log('listingType typeof: ', typeof(listingType))
                    let listingDetails;
                    console.log('listingDetails created....')
                    switch (listingType) {
                        case '1':
                            listingDetails = await marketplaceContract.call('getListing', [id + 1]);
                            break;
                        case '2':
                            listingDetails = await marketplaceContract.call('getAuction', [id + 1]);
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
            console.log('userActiveListings: ', userActiveListings)
            setUsersActiveListings(userActiveListings);
        };

        fetchUserActiveListings();
    }, [marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents]);

    return usersActiveListings;
    
}
