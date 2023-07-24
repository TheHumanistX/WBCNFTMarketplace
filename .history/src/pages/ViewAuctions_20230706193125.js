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
  const [bidAmount, setBidAmount] = useState(0);
  const [txConfirm, setTxConfirm] = useState(null);
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
      console.log('currentListings[0]: ', currentListings[0])

      // Fetch minBidIncrement and status for each listing
      const auctionDetails = await Promise.all(
        currentListings.map((listing) =>
          marketplaceContract.call('getAuction', [listing.auctionID])
        )
      );

      const listingStatuses = auctionDetails.map(auctionDetail => auctionDetail[7]);  // Assuming status is at index 6 of the returned tuple
      const minBidIncrements = auctionDetails.map(auctionDetail => auctionDetail[4]);  // Assuming minBidIncrement is at index 4 of the returned tuple
      const currentBids = auctionDetails.map(auctionDetail => auctionDetail[3]);  // Assuming currentBid is at index 4 of the returned tuple

      // Add minBidIncrement to each listing
      currentListings.forEach((listing, index) => {
        listing.minBidIncrement = minBidIncrements[index];
        console.log('listing.minBidIncrement: ', listing.minBidIncrement)
        listing.currentBid = currentBids[index];
        console.log('listing.currentBid: ', listing.currentBid)
        listing.formattedMinBidIncrement = ethers.utils.formatEther(minBidIncrements[index]);
        console.log('listing.formattedMinBidIncrement: ', listing.formattedMinBidIncrement)
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

  const bidWithWBC = async (bidAmount, auctionID) => {
    if (parseFloat(bidAmount) <= 0) {
      console.log('Bid amount must be greater than zero');
      return;
    }
    let approval;
    const weiBidAmount = ethers.utils.parseEther(bidAmount);
    try {
      approval = await approve({ args: [marketplaceContractAddress, weiBidAmount] });
      console.log("wbc amount approval success", approval);
    } catch (error) {
      console.log("wbc amount approval failure", error);
    }

    if (approval && approval.receipt.status === 1) {
      try {
        console.log('Bidding with WBC...')
        console.log('bidWithWBC auctionID: ', auctionID)
        console.log('bidWithWBC bidAmount: ', bidAmount)
        console.log('bidWithWBC weiBidAmount: ', weiBidAmount)

        const transaction = await marketplaceContract.call('erc20BidAmount', [auctionID, weiBidAmount]);
        if (transaction.receipt.status === 1) {
          console.info("contract call successs", transaction);
          setTxConfirm(transaction.receipt.blockHash);
          console.log('Bid placed with WBC!');
        } else {
          console.error("Transaction failed");
        }
      } catch (error) {
        console.error('Failed to bid with WBC', error);
      }
    }
  }

  const bidWithETH = async (bidAmount, auctionID) => {
    if (parseFloat(bidAmount) <= 0) {
      console.log('Bid amount must be greater than zero');
      return;
    }
    try {

      console.log('Bidding with ETH...')

      console.log('bidWithETH bidAmount: ', bidAmount)
      console.log('bitWithEth auctionID: ', auctionID)
      const weiBidAmount = ethers.utils.parseEther(bidAmount, 'ether');
      const minETHBidAmount = await marketplaceContract.call('getMinETHBidAmount', [auctionID])
      if (weiBidAmount < minETHBidAmount) {
        console.log('Bid amount must be greater than or equal to the minimum bid amount.');
        return;
      }
      console.log('Bid Amount is greater than or equal to minETHBidAmount')
      const transaction = await marketplaceContract.call('ethBidAmount', [auctionID], { value: weiBidAmount });
      if (transaction.receipt.status === 1) {
        console.info("contract call successs", transaction);
        setTxConfirm(transaction.receipt.blockHash);
        console.log('Bid placed with ETH!');
      } else {
        console.error("Transaction failed");
      }
    } catch (error) {
      console.error('Failed to bid with ETH', error);
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
              {console.log('Before ShowListedNFTs listing: ', listing)}

              <ShowListedNFTs listing={listing} marketplaceContract={marketplaceContract} bidWithETH={bidWithETH} bidWithWBC={bidWithWBC} />

            </div>
          )
        }
        )}
      </div>
    </section>
  )
}

export default ViewAuctions
