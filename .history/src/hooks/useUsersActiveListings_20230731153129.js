import react, { useEffect, useState } from 'react';
import { useEthers, useMarketplace } from '../context';

export const useUsersActiveListings = ( marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents ) => {
    const { userWalletAddress } = useEthers();
    const { marketplaceContract } = useMarketplace();
    const [usersActiveListings, setUsersActiveListings] = useState([]);
    
    useEffect(() => {
        if (!marketplaceContract || !userWalletAddress || !marketplaceNFTListedEvents || !marketplaceAuctionCreatedEvents) {
            return;
        }
        const fetchUserActiveListings = async () => {

            const listedIDs = marketplaceNFTListedEvents.map(event => event.data.listingID.toNumber());
            const auctionIDs = marketplaceAuctionCreatedEvents.map(event => event.data.auctionID.toNumber());     

            const allIDs = [...listedIDs, ...auctionIDs];
            const userActiveListings = [];

            for (let id of allIDs) {
                try {
                    const listingType = await marketplaceContract.call('getItemType', [id]);
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
               
                    if (saleListingDetails && saleListingDetails.status === 1 && saleListingDetails.owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                        userActiveListings.push(saleListingDetails);
                    } else if(auctionListingDetails && auctionListingDetails.status === 1 || 2 || 3 && auctionListingDetails.owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                        userActiveListings.push(auctionListingDetails);
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
