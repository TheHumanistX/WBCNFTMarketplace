import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ShowListedNFTs } from '../components'

const ViewAuctions = () => {
  const {
    ETHEREUM_NULL_ADDRESS,
    marketplaceContractAddress,
    marketplaceContract,
    marketplaceAuctionCreatedEvents,
    tokenContract,
    userWalletAddress,
  } = useContext(MarketplaceContext);

  const [newListings, setNewListings] = useState([]);
  const [liveListings, setLiveListings] = useState([]);
  const [listingStatuses, setListingStatuses] = useState({});
  const { data: tokenSymbol } = useContractRead(tokenContract, 'symbol');
  const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  const { mutateAsync: buyNFT } = useContractWrite(marketplaceContract, "buyNFT")

  useEffect(() => {
    if (!marketplaceAuctionCreatedEvents) {
      return;
    }

    const fetchEvents = async () => {
      console.log('Entered fetchEvents...');
      const currentListings = marketplaceAuctionCreatedEvents.map((event) => ({
        owner: event.data.owner,
        nftContractAddress: event.data.nftContract,
        auctionID: event.data.auctionID.toNumber(),
        tokenId: event.data.tokenID.toNumber(),
        paymentContractAddress: event.data.paymentContract,
        initialBid: event.data.initBid,
        beginDate: event.data.beginDate,
        expiration: event.data.expiration,
        formattedInitialBid: ethers.utils.formatEther(event.data.initBid),
        formattedPriceSymbol: event.data.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
        formattedBeginDate: new Date(event.data.beginDate.toNumber() * 1000).toLocaleString(),
        formattedExpiration: new Date(event.data.expiration.toNumber() * 1000).toLocaleString(),
      }));

      console.log('currentListings: ', currentListings)
      console.log('currentListings[0].auctionID: ', currentListings[0].auctionID)

      // Fetch minBidIncrement and status for each listing
      const auctionDetails = await Promise.all(
        currentListings.map((listing) =>
          marketplaceContract.call('getAuction', [listing.auctionID])
        )
      );

      const listingStatuses = auctionDetails.map(auctionDetail => auctionDetail[6]);  // Assuming status is at index 6 of the returned tuple
      const minBidIncrements = auctionDetails.map(auctionDetail => auctionDetail[4]);  // Assuming minBidIncrement is at index 4 of the returned tuple
      const currentBids = auctionDetails.map(auctionDetail => auctionDetail[3]);  // Assuming currentBid is at index 4 of the returned tuple

      // Add minBidIncrement to each listing
      currentListings.forEach((listing, index) => {
        listing.minBidIncrement = minBidIncrements[index];
        listing.currentBid = currentBids[index];
        listing.formattedMinBidIncrement = ethers.utils.formatEther(minBidIncrements[index]);
        listing.formattedCurrentBid = ethers.utils.formatEther(currentBids[index]);
      });

      console.log('listingStatuses: ', listingStatuses)
      // Filter the current listings by status
      const newListings = currentListings.filter(
        (listing, i) => listingStatuses[i] === 1
      );
      const activeListings = currentListings.filter(
        (listing, i) => listingStatuses[i] === 2
      );

      // const expiredListings = currentListings.filter(
      //   (listing, i) => listingStatuses[i] === 3
      // );

      // const wonListings = currentListings.filter(
      //   (listing, i) => listingStatuses[i] === 4
      // );


      console.log('newListings: ', newListings)
      console.log('activeListings: ', activeListings)
      // console.log('expiredListings: ', expiredListings)
      // console.log('wonListings: ', wonListings)

      setNewListings(newListings);
      setLiveListings(activeListings);
    };

    fetchEvents();
  }, [marketplaceContract, marketplaceAuctionCreatedEvents]);

  // useEffect(() => {

  //   if (!marketplaceAuctionCreatedEvents) {
  //     return;
  //   }
  //   console.log('marketplaceAuctionCreatedEvents: ', marketplaceAuctionCreatedEvents)
  //   const fetchEvents = async () => {

  //     console.log('Entered fetchEvents...');



  //     // Create the currentListings array as before
  //     const currentListings = marketplaceAuctionCreatedEvents.map((event) => ({
  //       nftContractAddress: event.data.nftContract,
  //       auctionID: event.data.auctionID.toNumber(),
  //       tokenID: event.data.tokenID.toNumber(),
  //       tokenContractAddress: event.data.paymentContract,
  //       initialBid: event.data.initBid,
  //       beginDate: event.data.beginDate,
  //       expiration: event.data.expiration,
  //       formattedInitialBid: ethers.utils.formatEther(event.data.initBid),
  //       formattedPriceSymbol: event.data.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
  //     }));

  //     console.log('currentListings: ', currentListings)
  //     console.log('currentListings[0].auctionID: ', currentListings[0].auctionID)

  //     // Fetch the status for each listing
  //     const listingStatuses = await Promise.all(
  //       currentListings.map((listing) =>
  //         marketplaceContract.call('getAuctionStatus', [listing.auctionID])

  //       )
  //     );
  //     console.log('listingStatuses: ', listingStatuses)
  //     // Filter the current listings by status
  //     const newListings = currentListings.filter(
  //       (listing, i) => listingStatuses[i] === 1
  //     );

  //     const activeListings = currentListings.filter(
  //       (listing, i) => listingStatuses[i] === 2
  //     );

  //     // const expiredListings = currentListings.filter(
  //     //   (listing, i) => listingStatuses[i] === 3
  //     // );

  //     // const wonListings = currentListings.filter(
  //     //   (listing, i) => listingStatuses[i] === 4
  //     // );


  //     console.log('newListings: ', newListings)
  //     console.log('activeListings: ', activeListings)
  //     // console.log('expiredListings: ', expiredListings)
  //     // console.log('wonListings: ', wonListings)

  //     setNewListings(newListings);
  //     // Set the active listings in state
  //     setLiveListings(activeListings);
  //   };

  //   fetchEvents();
  // }, [marketplaceContract, marketplaceAuctionCreatedEvents]);

  const bidWithWBC = async (listingPrice, auctionID) => {
    let approval;
    // console.log('buyWithWBC auctionID: ', auctionID);
    try {
      approval = await approve({ args: [marketplaceContractAddress, listingPrice] });
      // console.log("wbc amount approval success", approval);
      // console.log("approval status", approval.receipt.status)
    } catch (err) {
      // console.log("wbc amount approval failure", err);
    }

    if (approval && approval.receipt.status === 1) {
      try {
        // console.log('Buying...')
        const transaction = await buyNFT({ args: [auctionID] });
        // console.info("contract call successs", transaction);
      } catch (err) {
        // console.error("contract call failure", err);
      }
    }
  }

  const bidWithETH = async (listingPrice, auctionID) => {
    try {
      console.log('Buying with ETH...')
      // console.log('listingPrice: ', listingPrice)

      // const ethAmount = ethers.utils.parseEther(listingPrice);
      const transaction = await buyNFT({ args: [auctionID], overrides: { value: listingPrice } });
      await transaction.wait(); // Wait for the transaction to be mined
      console.log('NFT bought with ETH');
    } catch (error) {
      console.error('Failed to buy NFT with ETH', error);
    }
  };

  return (
    <section className='buy__container'>
      <h1>Bid On An NFT!</h1>
      <div className='buy__owned-grid'>
        {console.log('Entering `liveListings` map function...')}
        {liveListings && liveListings.map((listing, index) => {
          return (
            <div key={index} className='listing-flex'>

              {console.log('Entering ShowListedNFTs Component...')}

              <ShowListedNFTs listing={listing} marketplaceContract={marketplaceContract} bidWithETH={bidWithETH} bidWithWBC={bidWithWBC} />

              <button className='buynft__button' onClick={() =>
                listing.tokenContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  buyWithETH(listing.price, listing.auctionID)
                  :
                  buyWithWBC(listing.price, listing.auctionID)}
              >
                Buy with
                {listing.tokenContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  ' ETH'
                  :
                  ' ' + tokenSymbol
                }
              </button>


            </div>
          )
        }
        )}
      </div>
      {/* {console.log('liveListings', liveListings ? liveListings : '')} */}
    </section>
  )
}

export default ViewAuctions