import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '../context';

export const useFetchListings = (marketplaceContract, listingTypeFilter, statusFilter) => {
  
  const { ETHEREUM_NULL_ADDRESS } = useEthers();

  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!marketplaceContract) return;

      try {
        let getLastListingID = await marketplaceContract.idCounter();
        getLastListingID = getLastListingID.toNumber();

        const listingData = await Promise.all(
          Array.from({ length: getLastListingID }, (_, i) => i).map(async (listingID) => {
            const type = await marketplaceContract.getItemType(listingID);
            return {
              listingID,
              listingType: type,
            };
          })
        );
        console.log('useFetchListings listingData: ', listingData);
        const filteredListingsByType = listingData.filter(listing => listing.listingType === listingTypeFilter);
          
        const statuses = listingTypeFilter === 1 ?
        await Promise.all(
          filteredListingsByType.map((listing) =>
            marketplaceContract.getListingStatus(listing.listingID)
          )
        )
        :
        await Promise.all(
          filteredListingsByType.map((listing) =>
            marketplaceContract.getAuctionStatus(listing.listingID)
          )
        )

        const filteredListingsByStatus = filteredListingsByType.filter(
          (listing, i) => statuses[i] === statusFilter
        );

        const currentListings = listingTypeFilter === 1 ?
        await Promise.all(filteredListingsByStatus.map(async (listing) => {
          const currentListing = await marketplaceContract.getListing(listing.listingID)
          return {
            listingID: listing.listingID,
            nftContractAddress: currentListing.nftContract,
            owner: currentListing.owner,
            price: currentListing.price,
            formattedPrice: ethers.utils.formatEther(currentListing.price),
            paymentMethodSymbol: currentListing.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
            paymentContractAddress: currentListing.paymentContract,
            tokenID: currentListing.tokenID.toNumber(),
          }
        }))
        :
        await Promise.all(filteredListingsByStatus.map(async (auction) => {
          const currentAuction = await marketplaceContract.getAuction(auction.listingID)
          return {
            auctionID: auction.listingID,
            nftContractAddress: currentAuction.nftContract,
            owner: currentAuction.owner,
            currentBid: currentAuction.currentBid,
            minBidIncrement: currentAuction.minBidIncrement,
            beginDate: currentAuction.beginTime,
            expiration: currentAuction.expiration,
            formattedCurrentBid: ethers.utils.formatEther(currentAuction.currentBid),
            formattedMinBidIncrement: ethers.utils.formatEther(currentAuction.minBidIncrement),
            formattedPriceSymbol: currentAuction.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
            formattedBeginDate: new Date(currentAuction.beginTime.toNumber() * 1000).toLocaleString(),
            formattedExpiration: new Date(currentAuction.expiration.toNumber() * 1000).toLocaleDateString()
              + " "
              + new Date(currentAuction.expiration.toNumber() * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            paymentContractAddress: currentAuction.paymentContract,
            tokenID: currentAuction.tokenID.toNumber(),
          }
        }));
        console.log('useFetchListings currentListings: ', currentListings)
        setListings(currentListings);
      } catch (err) {
        console.error('Error fetching listings: ', err.message)
      }
    };

    fetchListings();
  }, [marketplaceContract]);

  return listings;
}
