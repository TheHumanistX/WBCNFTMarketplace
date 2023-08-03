import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace } from '../context';
import { AlertModal, AuctionSalesManagementButton, ShowListedNFTs } from '../components'
import { useCheckAuctionCollectSalesCancel, useSpendWithETH, useSpendWithWBC } from '../hooks';
import { buyListingCheck } from '../utility';

const BuyNFT = () => {
  const location = useLocation();
  const path = location.pathname;

  const {
    ETHEREUM_NULL_ADDRESS
  } = useEthers();

  const {
    marketplaceContract
  } = useMarketplace();

  // Initialize state variables
  const [liveListings, setLiveListings] = useState([]);
  const [txConfirm, setTxConfirm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [displayButton, setDisplayButton] = useState(false);

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(setDisplayButton, setIsOpen, setModalText);
  const { spendWithWBC } = useSpendWithWBC({ setIsOpen, setModalText });
  const { spendWithETH } = useSpendWithETH({ setIsOpen, setModalText });

  useEffect(() => {
    const fetchListingStatuses = async () => {

      if (!marketplaceContract) return;

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

  }, [marketplaceContract, txConfirm]);

  const buyWithWBC = async (listingPrice, listingID, owner) => {
    if(!await buyListingCheck(owner, userWalletAddress)) return;
    try {
      await spendWithWBC(listingID, listingPrice, setTxConfirm, path);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to buy with WBC. See console for more information.`);
      console.error('Failed to buy with WBC: ', err);
    }
  }
  
  const buyWithETH = async (listingPrice, listingID, owner) => {
    if(!await buyListingCheck(owner, userWalletAddress)) return;
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
