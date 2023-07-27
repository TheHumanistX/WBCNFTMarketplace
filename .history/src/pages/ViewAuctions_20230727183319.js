import React, { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace, useToken } from '../context';
import { AlertModal, AuctionSalesManagementButton, ShowListedNFTs } from '../components'
import { approveTokenSpend, bidOnAuctionInputChecks, tokenSpend, ethSpend } from '../utility';

const ViewAuctions = () => {
  const location = useLocation();
  const path = location.pathname;


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
    tokenContract
  } = useToken();

  // Initialize state variables
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [txConfirm, setTxConfirm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [displayButton, setDisplayButton] = useState(false);


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
      console.log('fetchListingStatuses activeAuctions: ', activeAuctions)
      const currentAuctions = await Promise.all(activeAuctions.map(async (auction) => {
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


  const bidWithWBC = useCallback(async (bidAmount, auctionID, minimumAllowableBid) => {
    if (!await bidOnAuctionInputChecks(bidAmount, minimumAllowableBid, setIsOpen, setModalText)) return;

    const weiBidAmount = ethers.utils.parseEther(bidAmount);
    let approval;
    try {
      approval = await approveTokenSpend(weiBidAmount, marketplaceContractAddress, tokenContract);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Error during token approval. Check console for error message.`);
      console.error("Error during token approval:", err);
      return;
    }


    try {
      await tokenSpend({ auctionID, weiBidAmount, marketplaceContract, setTxConfirm, path, approval });
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to bid with WBC. Check console for error message.`);
      console.error('Failed to bid with WBC: ', err);
    }

  }, [marketplaceContractAddress, marketplaceContract, path, tokenContract]);

  const bidWithETH = useCallback(async (bidAmount, auctionID, minimumAllowableBid) => {
    console.log('bidWithETH parseFloat(bidAmount): ', parseFloat(bidAmount))
    console.log('bidWithETH minimumAllowableBid: ', minimumAllowableBid)
    console.log('Bidding with ETH...')

    console.log('bidWithETH bidAmount: ', bidAmount)
    console.log('bidWithETH typeof(bidAmount): ', typeof (bidAmount))
    console.log('bitWithEth auctionID: ', auctionID)
    if (!await bidOnAuctionInputChecks(bidAmount, minimumAllowableBid, setIsOpen, setModalText)) return;
    const weiBidAmount = ethers.utils.parseEther(bidAmount, 'ether');

    try {
      await ethSpend({ auctionID, weiBidAmount, marketplaceContract, setTxConfirm, path });
      console.log('Bid placed with ETH!');
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to bid with ETH. Check console for error message.`);
      console.error('Failed to bid with ETH: ', err.message);
    }
  }, [marketplaceContract, path]);

  return (
    <section className='buy__container'>
      {displayButton && <AuctionSalesManagementButton setDisplayButton={setDisplayButton} />}
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
      <AlertModal open={isOpen} onClose={() => setIsOpen(false)}>
        {modalText}
      </AlertModal>
    </section>
  )
}

export default ViewAuctions
