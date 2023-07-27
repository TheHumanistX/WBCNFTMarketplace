import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { useEthers, useMarketplace, useToken } from '../context';
import { ShowListedNFTs } from '../components'
import { approveTokenSpend, tokenSpend } from '../utility';

const ViewAuctions = () => {
  const location = useLocation();
  const path = location.pathname;
  const {


    marketplaceAuctionCreatedEvents, //! Need to figure out events


  } = useContext(MarketplaceContext);

  // Import necessary context data for this component
  const {
    ETHEREUM_NULL_ADDRESS,
    userWalletAddress,
  } = useEthers();

  const {
    marketplaceContractAddress,
    marketplaceContract,
  } = useMarketplace();

  const {
    tokenContract,
    tokenSymbol,
  } = useToken();

  // Initialize state variables
  const [newListings, setNewListings] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [listingStatuses, setListingStatuses] = useState({});
  const [bidSuccessfulSwitch, setBidSuccessfulSwitch] = useState(false);
  const [txConfirm, setTxConfirm] = useState(null);
  // const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  // const { mutateAsync: buyNFT } = useContractWrite(marketplaceContract, "buyNFT")

  // useEffect(() => {
  //   if (!marketplaceAuctionCreatedEvents) {
  //     return;
  //   }

  //   const fetchEvents = async () => {
  //     console.log('Entered fetchEvents...');
  //     const currentListings = marketplaceAuctionCreatedEvents.map((event) => ({
  //       owner: event.data.owner,
  //       nftContractAddress: event.data.nftContract,
  //       auctionID: event.data.auctionID.toNumber(),
  //       tokenId: event.data.tokenID.toNumber(),
  //       paymentContractAddress: event.data.paymentContract,
  //       initialBid: event.data.initBid,
  //       beginDate: event.data.beginDate,
  //       expiration: event.data.expiration,
  //       formattedInitialBid: ethers.utils.formatEther(event.data.initBid),
  //       formattedPriceSymbol: event.data.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
  //       formattedBeginDate: new Date(event.data.beginDate.toNumber() * 1000).toLocaleString(),
  //       formattedExpiration: new Date(event.data.expiration.toNumber() * 1000).toLocaleString(),
  //     }));

  //     console.log('currentListings: ', currentListings)
  //     console.log('currentListings[0]: ', currentListings[0])

  //     // Fetch minBidIncrement and status for each listing
  //     const auctionDetails = await Promise.all(
  //       currentListings.map((listing) =>
  //         marketplaceContract.call('getAuction', [listing.auctionID])
  //       )
  //     );

  //     const listingStatuses = auctionDetails.map(auctionDetail => auctionDetail[7]);  // Assuming status is at index 6 of the returned tuple
  //     const minBidIncrements = auctionDetails.map(auctionDetail => auctionDetail[4]);  // Assuming minBidIncrement is at index 4 of the returned tuple
  //     const currentBids = auctionDetails.map(auctionDetail => auctionDetail[3]);  // Assuming currentBid is at index 4 of the returned tuple

  //     // Add minBidIncrement to each listing
  //     currentListings.forEach((listing, index) => {
  //       listing.minBidIncrement = minBidIncrements[index];
  //       console.log('listing.minBidIncrement: ', listing.minBidIncrement)
  //       listing.currentBid = currentBids[index];
  //       console.log('listing.currentBid: ', listing.currentBid)
  //       listing.formattedMinBidIncrement = ethers.utils.formatEther(minBidIncrements[index]);
  //       console.log('listing.formattedMinBidIncrement: ', listing.formattedMinBidIncrement)
  //       listing.formattedCurrentBid = ethers.utils.formatEther(currentBids[index]);
  //     });

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
  //     setLiveListings(activeListings);
  //   };

  //   fetchEvents();
  // }, [marketplaceContract, marketplaceAuctionCreatedEvents, txConfirm, userWalletAddress]);

  useEffect(() => {
    console.log('Entered useEffect in ViewAuctions...')
    console.log('marketplaceContract: ', marketplaceContract)
    if (!marketplaceContract) return;
    const fetchListingStatuses = async () => {
      console.log('Entered fetchListingStatuses...')
      console.log('fetchListingStatuses if statement passed...')
      let getLastListingID = await marketplaceContract.idCounter();
      getLastListingID = getLastListingID.toNumber();
      console.log('fetchListingStatuses getLastListingID: ', getLastListingID)
      const listingData = await Promise.all(
        Array.from({ length: getLastListingID }, (_, i) => i).map(async (listingID) => {
          const listingType = await marketplaceContract.getItemType(listingID)
          return {
            listingID: listingID,
            listingType: listingType
          };
        })
      );
      console.log('fetchListingStatuses listingData: ', listingData)
      const listingTypes = listingData.filter(listing => listing.listingType === 2);
      console.log('fetchListingStatuses listingTypes: ', listingTypes)
      const auctionStatuses = await Promise.all(
        listingTypes.map((listing) =>
          marketplaceContract.getAuctionStatus(listing.listingID)
        )
      );
      console.log('fetchListingStatuses auctionStatuses: ', auctionStatuses)
      const activeAuctions = listingTypes.filter(
        (listing, i) => auctionStatuses[i] === 2
      );

      const currentAuctions = await Promise.all(activeAuctions.map(async (auction) => {
        const currentAuction = await marketplaceContract.getAuction(auction.listingID)
        return {
          auctionID: auction.listingID,
          nftContractAddress: currentAuction.nftContract,
          owner: currentAuction.owner,
          currentBid: currentAuction.currentBid,
          beginDate: currentAuction.beginTime,
          expiration: currentAuction.expiration,
          formattedCurrentBid: ethers.utils.formatEther(currentAuction.currentBid),
          formattedPriceSymbol: currentAuction.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
          formattedBeginDate: new Date(currentAuction.beginTime.toNumber() * 1000).toLocaleString(),
          formattedExpiration: new Date(currentAuction.expiration.toNumber() * 1000).toLocaleString(),
          paymentContractAddress: currentAuction.paymentContract,
          tokenID: currentAuction.tokenID.toNumber(),
        }
      }));

      setLiveAuctions(currentAuctions);
      console.log('ViewAuctions liveAuctions: ', liveAuctions)
    }

    fetchListingStatuses();

  }, [marketplaceContract, txConfirm, userWalletAddress]);


  const bidWithWBC = useCallback(async (bidAmount, auctionID) => {
    if (parseFloat(bidAmount) <= 0) {
      console.log('Bid amount must be greater than zero');
      return;
    }
    const weiBidAmount = ethers.utils.parseEther(bidAmount);
    let approval;
    try {
      approval = await approveTokenSpend(weiBidAmount, marketplaceContractAddress, tokenContract);
    } catch (err) {
      console.error("Error during token approval:", err);
      return;
    }

    if (approval && approval.receipt.status === 1) {
      try {
        await tokenSpend(auctionID, weiBidAmount, marketplaceContract, setTxConfirm, path);
      } catch (err) {
        console.error('Failed to bid with WBC', err);
        return;
      }
    } else {
      console.error("Transaction failed");
    }
  }, [marketplaceContractAddress, marketplaceContract, bidSuccessfulSwitch]);

  const bidWithETH = useCallback(async (bidAmount, auctionID) => {
    if (parseFloat(bidAmount) <= 0) {
      console.log('Bid amount must be greater than zero');
      return;
    }
    try {

      console.log('Bidding with ETH...')

      console.log('bidWithETH bidAmount: ', bidAmount)
      console.log('bidWithETH typeof(bidAmount): ', typeof (bidAmount))
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
        setBidSuccessfulSwitch(!bidSuccessfulSwitch);
      }
    } catch (error) {
      console.error('Failed to bid with ETH', error);
    }
  }, [marketplaceContract, bidSuccessfulSwitch]);

  return (
    <section className='buy__container'>
      <h1>Bid On An NFT!</h1>
      <div className='buy__owned-flex'>
        {console.log('Entering `liveListings` map function...')}
        {liveAuctions && liveAuctions.map((auction, index) => {
          return (
            <div key={index}>

              {console.log('Entering ShowListedNFTs Component...')}
              {console.log('Before ShowListedNFTs listing: ', auction)}

              <ShowListedNFTs listing={auction} marketplaceContract={marketplaceContract} bidWithETH={bidWithETH} bidWithWBC={bidWithWBC} />
            </div>
          )
        }
        )}
      </div>
    </section>
  )
}

export default ViewAuctions
