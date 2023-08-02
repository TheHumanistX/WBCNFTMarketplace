import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace, useToken } from '../context';
import { approveTokenSpend, ethSpend, tokenSpend } from '../utility';
import { AlertModal, AuctionSalesManagementButton, ShowListedNFTs } from '../components'
import { useCheckAuctionCollectSalesCancel, useSpendWithETH, useSpendWithWBC } from '../hooks';

const BuyNFT = () => {
  const location = useLocation();
  const path = location.pathname;

  const { 
    ETHEREUM_NULL_ADDRESS
  } = useEthers();

  const {
    tokenContract,
  } = useToken();

  const {
    marketplaceContractAddress,
    marketplaceContract
  } = useMarketplace();

  // Initialize state variables
  const [liveListings, setLiveListings] = useState([]);
  const [txConfirm, setTxConfirm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [displayButton, setDisplayButton] = useState(false);

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(setDisplayButton);
  const { spendWithWBC } = useSpendWithWBC({ setIsOpen, setModalText });
  const { spendWithETH } = useSpendWithETH({ setIsOpen, setModalText });

  useEffect(() => {
    const fetchListingStatuses = async () => {

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
      const listingTypes = listingData.filter(listing => listing.listingType === 1);

      const listingStatuses = await Promise.all(
        listingTypes.map((listing) =>
          marketplaceContract.getListingStatus(listing.listingID)
        )
      );

      const activeListings = listingTypes.filter(
        (listing, i) => listingStatuses[i] === 1
      );

      const currentListings = await Promise.all(activeListings.map(async (listing) => {
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
      }));

      setLiveListings(currentListings);
    }

    fetchListingStatuses();

  }, [marketplaceContract, txConfirm]);

  const buyWithWBC = async (listingPrice, listingID) => {
    await spendWithWBC(listingID, listingPrice, setTxConfirm, path);
  }

  const buyWithETH = async (listingPrice, listingID) => {
    await spendWithETH( listingID, listingPrice, setTxConfirm, path);
  }
  
  return (
    <section className='buynft__container'>
      {displayButton && (
        console.log('Entering AuctionSalesManagementButton...'),
        <AuctionSalesManagementButton
          activeSales={activeSales}
          expiredAuctions={expiredAuctions}
          wonAuctions={wonAuctions}
          setDisplayButton={setDisplayButton}
        />
      )}
      <h1>Buy An NFT!</h1>
      <div className='buy__owned-flex'>
        {/* {console.log('Entering `liveListings` map function...')} */}
        {liveListings && liveListings.map((listing, index) => {
          return (
            <div key={index}>
              {/* {console.log('Entering ShowListedNFTs Component...')} */}
              {console.log('listing right before ShowListedNFTs: ', listing)}
              <ShowListedNFTs listing={listing} marketplaceContract={marketplaceContract} buyWithETH={buyWithETH} buyWithWBC={buyWithWBC} />
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
