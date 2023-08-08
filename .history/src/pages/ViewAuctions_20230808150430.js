import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace } from '../context';
import { AlertModal, AuctionSalesManagementButton, ShowListedNFTs } from '../components'
import { bidOnAuctionInputChecks } from '../utility';
import { useCheckAuctionCollectSalesCancel, useFetchListings, useSpendWithETH, useSpendWithWBC } from '../hooks';

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
  const [txConfirm, setTxConfirm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [displayButton, setDisplayButton] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(setDisplayButton, setIsOpen, setModalText);
  const { spendWithWBC } = useSpendWithWBC({ setIsOpen, setModalText });
  const { spendWithETH } = useSpendWithETH({ setIsOpen, setModalText });
  const liveAuctions = useFetchListings(2, 2);

  const bidWithWBC = async (bidAmount, auctionID, minimumAllowableBid, owner) => {
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

  const bidWithETH = async (bidAmount, auctionID, minimumAllowableBid, owner) => {
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
