import react, { useEffect, useState } from 'react';

export const useUsersActiveListings = ( marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents ) => {
    const [usersActiveListings, setUsersActiveListings] = useState([]);
    
    useEffect(() => {
        if (!marketplaceContract || !userWalletAddress || !marketplaceNFTListedEvents || !marketplaceAuctionCreatedEvents) {
            return;
        }
        const fetchUserActiveListings = async () => {
            // console.log('Fetching active listings for wallet address: ', userWalletAddress);
            const listedIDs = marketplaceNFTListedEvents.map(event => event.data.listingID.toNumber());
            // console.log('marketplaceListedEvents: ', marketplaceNFTListedEvents)
            // console.log('Listing IDs: ', listedIDs);
            const auctionIDs = marketplaceAuctionCreatedEvents.map(event => event.data.auctionID.toNumber());
                console.log('marketplaceAuctionCreatedEvents: ', marketplaceAuctionCreatedEvents)
                console.log('Auction IDs: ', auctionIDs)

            // ! Realized active sale is status=1 while active auctions is status=2 but ALSO auctions have muiltiple states where the NFT
            // ! is in the custody of the marketplace... statuses 1,2,3,4 for auctions. Do we need all of those for this hook? Not sure, 
            // ! need to think about that and decide... this is just to regain context of what I was working on. 
            

            const allIDs = [...listedIDs, ...auctionIDs];
            const userActiveListings = [];

            for (let id of allIDs) {
                // console.log('type of "id": ', typeof(id))
                try {
                    // console.log('Entered try block...')
                    const listingType = await marketplaceContract.call('getItemType', [id]);
                    console.log('listingType: ', listingType)
                    console.log('listingType typeof: ', typeof(listingType))
                    let saleListingDetails;
                    let auctionListingDetails;
                    // console.log('listingDetails created....')
                    switch (listingType) {
                        case 1:
                            saleListingDetails = await marketplaceContract.call('getListing', [id]);
                            break;
                        case 2:
                            auctionListingDetails = await marketplaceContract.call('getAuction', [id]);
                            break;
                        default:
                            throw new Error('Unexpected item type');
                    }
                    console.log('saleListingDetails: ', saleListingDetails)
                    console.log('auctionListingDetails: ', auctionListingDetails)
                    console.log('saleListingDetails.status: ', saleListingDetails.status)
                    console.log('auctionListingDetails.status: ', auctionListingDetails.status)
                    if (saleListingDetails && saleListingDetails.status === 1 && saleListingDetails.owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                        userActiveListings.push(saleListingDetails);
                    } else if(auctionListingDetails && auctionListingDetails.status === 1 || 2 || 3 && auctionListingDetails.owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                        userActiveListings.push(auctionListingDetails);
                    }

                } catch (error) {
                    console.error(`Error fetching details for listing ID ${id}: ${error.message}`);
                }
                console.log('userActiveListings: ', userActiveListings)
            }
            console.log('userActiveListings: ', userActiveListings)
            setUsersActiveListings(userActiveListings);
        };

        fetchUserActiveListings();
    }, [marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents]);

    return usersActiveListings;
    
}
