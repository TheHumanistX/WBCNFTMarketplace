import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useFetchListings = (marketplaceContract, listingTypeFilter, statusFilter) => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!marketplaceContract) return;

      try {
        let getLastListingID = await marketplaceContract.idCounter();
        getLastListingID = getLastListingID.toNumber();

        const listingData = await Promise.all(
          Array.from({ length: getLastListingID }, (_, i) => i + 1).map(async (listingID) => {
            const type = await marketplaceContract.getItemType(listingID);
            return {
              listingID,
              listingType: type,
            };
          })
        );
          console.log('useFetchListings listingData: ', listingData);
        const filteredListingsByType = listingData.filter(listing => listing.listingType === listingTypeFilter);

        const statuses = await Promise.all(
          filteredListingsByType.map((listing) =>
            marketplaceContract.getListingStatus(listing.listingID)
          )
        );

        const filteredListingsByStatus = filteredListingsByType.filter(
          (listing, i) => statuses[i] === statusFilter
        );

        setListings(filteredListingsByStatus);
      } catch (err) {
        setError(err);
      }
    };

    fetchListings();
  }, [marketplaceContract]);

  return [listings, error];
}
