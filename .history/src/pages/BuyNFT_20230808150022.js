import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace } from '../context';
import { AlertModal, AuctionSalesManagementButton, ShowListedNFTs } from '../components'
import { buyListingCheck } from '../utility';
import { useCheckAuctionCollectSalesCancel, useFetchListings, useSpendWithETH, useSpendWithWBC } from '../hooks';

const BuyNFT = () => {
  const location = useLocation();
  const path = location.pathname;

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

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(setDisplayButton, setIsOpen, setModalText);
  const { spendWithWBC } = useSpendWithWBC({ setIsOpen, setModalText });
  const { spendWithETH } = useSpendWithETH({ setIsOpen, setModalText });
  const liveListings = useFetchListings(marketplaceContract, 1, 1); 
  
  const buyWithWBC = async (listingPrice, listingID, owner) => {
    if(!await buyListingCheck(owner, userWalletAddress, setIsOpen, setModalText)) return;
    try {
      await spendWithWBC(listingID, listingPrice, setTxConfirm, path);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to buy with WBC. See console for more information.`);
      console.error('Failed to buy with WBC: ', err);
    }
  }
  
  const buyWithETH = async (listingPrice, listingID, owner) => {
    if(!await buyListingCheck(owner, userWalletAddress, setIsOpen, setModalText)) return;
    try {
      console.log('BuyNFT buyWithETH(), calling `await spendWithETH`: ')
      await spendWithETH(listingID, listingPrice, setTxConfirm, path);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to buy with ETH. See console for more information.`);
      console.error('Failed to buy with ETH: ', err.message);
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
      <h1>Buy An NFT!</h1>
      <div className='buy__owned-flex'>
        {liveListings && liveListings.map((listing, index) => {
          return (
            <div key={index}>
              <ShowListedNFTs
                listing={listing}
                marketplaceContract={marketplaceContract}
                buyWithETH={buyWithETH}
                buyWithWBC={buyWithWBC}
              />
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

export default BuyNFT
