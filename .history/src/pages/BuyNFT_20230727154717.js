import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useMarketplace, useToken } from '../context';
import { approveTokenSpend, ethSpend, tokenSpend } from '../utility';
import { ShowListedNFTs } from '../components'

const BuyNFT = () => {
  const location = useLocation();
  const path = location.pathname;

  const { ETHEREUM_NULL_ADDRESS } = useEthers();

  const {
    tokenContract,
  } = useToken();

  const {
    marketplaceContractAddress,
    marketplaceContract,
  } = useMarketplace();

  // Initialize state variables
  const [liveListings, setLiveListings] = useState([]);
  const [txConfirm, setTxConfirm] = useState(null);

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
    let approval;
    try {
      approval = await approveTokenSpend(listingPrice, marketplaceContractAddress, tokenContract);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Error during token approval. Check console for error message.`);
      console.error("Error during token approval:", err);
      return;
    }

    try {
      // console.log('Buying with ERC20...')
      await tokenSpend({ listingID, marketplaceContract, setTxConfirm, path, approval });
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to bid with WBC. Check console for error message.`);
      console.error('Failed to bid with WBC: ', err);
    }
  }

  const buyWithETH = async (listingPrice, listingID) => {
    try {
      console.log('Buying with ETH...')
      await ethSpend({ listingID, listingPrice, marketplaceContract, setTxConfirm, path });
    } catch (err) {
      console.error('Failed to buy NFT with ETH', err);
    }
  };

  return (
    <section className='buy__container'>
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
    </section>
  )
}

export default BuyNFT
