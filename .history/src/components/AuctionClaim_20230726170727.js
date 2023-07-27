import React, { useState } from 'react'
import { useEthers, useMarketplace } from '../context';

const AuctionClaim = () => {

    const { marketplaceContract } = useMarketplace();
    const [wonAuctions, setWonAuctions] = useState([])

    useEffect(() => {
        const fetchClaimableAuctions = async () => {
            if (!marketplaceContract) return;
            let getLastListingID = await marketplaceContract.idCounter();
            getLastListingID = getLastListingID.toNumber();
            const listingData = await Promise.all(
                Array.from({ length: getLastListingID }, (_, i) => i).map(async (listingID) => {
                    const listingType = await marketplaceContract.getItemType(listingID)
                    return {
                        listingID: listingID,
                        listingType: listingType
                    };
                })
            );
            const listingTypes = listingData.filter(listing => listing.listingType === 2);
            const listingStatuses = await Promise.all(
                listingTypes.map((listing) =>
                    marketplaceContract.getAuctionStatus(listing.listingID)
                )
            );
            const wonAuctions = listingTypes.filter(
                (listing, i) => listingStatuses[i] === 4
            );
            console.log('wonAuctions: ', wonAuctions)    
            setWonAuctions(wonAuctions);
        }
        fetchClaimableAuctions();
    }, []);

    return (
        <div>

        </div>
    )
}

export default AuctionClaim
