import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace } from '../context';
import { AlertModal, AuctionSalesManagementButton, ShowListedNFTs } from '../components'
import { bidOnAuctionInputChecks } from '../utility';
import { useCheckAuctionCollectSalesCancel, useSpendWithETH, useSpendWithWBC } from '../hooks';

const ViewAuctions = () => {
  const location = useLocation();
  const path = location.pathname;


  // Import necessary context data for this component
  const {
    ETHEREUM_NULL_ADDRESS,
    userWalletAddress
  } = useEthers();

  const {
    marketplaceContract
  } = useMarketplace();

  // Initialize state variables
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [txConfirm, setTxConfirm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [displayButton, setDisplayButton] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(setDisplayButton, setIsOpen, setModalText);
  const { spendWithWBC } = useSpendWithWBC({ setIsOpen, setModalText });
  const { spendWithETH } = useSpendWithETH({ setIsOpen, setModalText });

  useEffect(() => {
    if (!marketplaceContract) return;
    const fetchListingStatuses = async () => {
      try {
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

        const auctionStatuses = await Promise.all(
          listingTypes.map((listing) =>
            marketplaceContract.getAuctionStatus(listing.listingID)
          )
        );

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

      } catch (err) {
        if (err.code === 'NETWORK_ERROR') {
          setIsOpen(true);
          setModalText(`Network Changed. Please switch network back to Goerli Test Network.`);
          console.error('A network error has occurred: ', err.message)
        } else {
          console.error('An error has occurred: ', err.message)
        }
      }
    }

    fetchListingStatuses();

  }, [marketplaceContract, timerComplete, txConfirm, userWalletAddress]);

  const bidWithWBC = async (bidAmount, auctionID, minimumAllowableBid) => {
    if (!await bidOnAuctionInputChecks(bidAmount, minimumAllowableBid, owner, userWalletAddress, setIsOpen, setModalText)) return;

    const weiBidAmount = ethers.utils.parseEther(bidAmount);
    
    try {
      await spendWithWBC(auctionID, weiBidAmount, setTxConfirm, path);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to bid with WBC. See console for more information.`);  
      console.error('Failed to bid with WBC: ', err);
    }
  }

  const bidWithETH = async (bidAmount, auctionID, minimumAllowableBid) => {
    if (!await bidOnAuctionInputChecks(bidAmount, minimumAllowableBid, owner, userWalletAddress, setIsOpen, setModalText)) return;
    
    const weiBidAmount = ethers.utils.parseEther(bidAmount, 'ether');

    try {
      await spendWithETH(auctionID, weiBidAmount, setTxConfirm, path);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to bid with ETH. See console for more information.`);  
      console.error('Failed to bid with ETH: ', err.message);
    }
  }

  return (
    <section className='buynft__container'>
      {displayButton && (
        <AuctionSalesManagementButton
          activeSales={activeSales}
          expiredAuctions={expiredAuctions}
          wonAuctions={wonAuctions}
          setDisplayButton={setDisplayButton}
        />
      )}
      <h1>Bid On An NFT!</h1>
      <div className='buy__owned-flex'>
        {liveAuctions && liveAuctions.map((auction, index) => {
          return (
            <div key={index}>
              <ShowListedNFTs listing={auction} marketplaceContract={marketplaceContract} bidWithETH={bidWithETH} bidWithWBC={bidWithWBC} timerComplete={timerComplete} setTimerComplete={setTimerComplete} />
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
