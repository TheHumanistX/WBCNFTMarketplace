import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { useEthers, useMarketplace, useToken } from '../context';
import { approveTokenSpend, tokenSpend } from '../utility';
import { ShowListedNFTs } from '../components'

const BuyNFT = () => {
  const location = useLocation();
  const path = location.pathname;
  // Import necessary context data for this component
  const { ETHEREUM_NULL_ADDRESS } = useEthers();

  const {
    tokenContract,
    tokenSymbol
  } = useToken();

  const {
    marketplaceContractAddress,
    marketplaceContract,
    marketplaceNFTListedEvents, //! Need to figure out event handling
  } = useMarketplace();

  // Initialize state variables
  const [liveListings, setLiveListings] = useState([]);
  const [listingStatuses, setListingStatuses] = useState({});
  const [txConfirm, setTxConfirm] = useState(null);

  // const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  // const { mutateAsync: buyERC20NFT } = useContractWrite(marketplaceContract, "buyERC20NFT")

  useEffect(() => {
    const fetchListingStatuses = async () => {
      console.log('BuyNFT entered fetchListingStatuses...')
      if (!marketplaceContract) return;
      console.log('BuyNFT passed if statement...')
      let getLastListingID = await marketplaceContract.idCounter();
      getLastListingID = getLastListingID.toNumber();
      console.log('getLastListingID: ', getLastListingID);

      const listingData = await Promise.all(
        Array.from({ length: getLastListingID }, (_, i) => i).map(async (listingID) => {
          const listingType = await marketplaceContract.getItemType(listingID)
          console.log('BuyNFT - listingType: ', listingType)
          return {
            listingID: listingID,
            listingType: listingType
          };
        })
      );
      const listingTypes = listingData.filter(listing => listing.listingType === 1);

      console.log('BuyNFT - listingTypes: ', listingTypes)

      const listingStatuses = await Promise.all(
        listingTypes.map((listing) =>
          marketplaceContract.getListingStatus(listing.listingID)
        )
      );

      const activeListings = listingTypes.filter(
        (listing, i) => listingStatuses[i] === 1
      );
      console.log('BuyNFT - activeListings: ', activeListings)

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
      console.log('BuyNFT - currentListings: ', currentListings)
      console.log('BuyNFT - liveListings: ', liveListings)
    }

    fetchListingStatuses();

  }, []);

  // useEffect(() => {

  //   if (!marketplaceNFTListedEvents) {
  //     console.log('No ListingCreated events...')
  //     return;
  //   }
  //   console.log('marketplaceNFTListedEvents: ', marketplaceNFTListedEvents)
  //   const fetchEvents = async () => {

  //     console.log('Entered fetchEvents...');

  //     // Create the currentListings array as before
  //     const currentListings = marketplaceNFTListedEvents.map((event) => ({
  //       listingID: event.data.listingID.toNumber(),
  //       nftContractAddress: event.data.nftContract,
  //       owner: event.data.owner,
  //       price: event.data.price,
  //       formattedPrice: ethers.utils.formatEther(event.data.price),
  //       paymentMethodSymbol: event.data.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
  //       paymentContractAddress: event.data.paymentContract,
  //       tokenID: event.data.tokenID.toNumber(),
  //     }));

  //     console.log('currentListings: ', currentListings)
  //     // Fetch the status for each listing
  //     const listingStatuses = await Promise.all(
  //       currentListings.map((listing) =>
  //         marketplaceContract.call('getListingStatus', [listing.listingID])

  //       )
  //     );

  //     // Filter the current listings by status
  //     const activeListings = currentListings.filter(
  //       (listing, i) => listingStatuses[i] === 1
  //     );

  //     // Set the active listings in state
  //     setLiveListings(activeListings);
  //   };

  //   fetchEvents();
  // }, [marketplaceContract, marketplaceNFTListedEvents, txConfirm]);


  const buyWithWBC = async (listingPrice, listingID) => {
    let approval;
    try {
      approval = await approveTokenSpend(listingPrice, marketplaceContractAddress, tokenContract);
    } catch (err) {
      console.error("Error during token approval:", err);
      return;
    }
    if (approval && approval.status === 1) {
      try {
        console.log('Buying with ERC20...')
        await tokenSpend(listingID, marketplaceContract, setTxConfirm, path)
      } catch (err) {
        console.error("contract call failure", err);
        return;
      }
    }
  }

  const buyWithETH = async (listingPrice, listingID) => {
    try {
      console.log('Buying with ETH...')
      console.log('listingPrice: ', listingPrice)

      // const ethAmount = ethers.utils.parseEther(listingPrice);
      // const ethAmount = ethers.utils.parseEther(listingPrice);
      // const transaction = await buyNFT({ args: [listingID],  overrides: { value: listingPrice }});
      const transaction = await marketplaceContract.call('buyETHNFT', [listingID], { value: listingPrice });
      if (transaction.receipt.status === 1) {
        console.info("contract call successs", transaction);
        setTxConfirm(transaction.receipt.blockHash);
        console.log('NFT bought with ETH');
      } else {
        console.error("Transaction failed");
      }
    } catch (error) {
      console.error('Failed to buy NFT with ETH', error);
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

              {/* <button className='buynft__button' onClick={() =>
                listing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  buyWithETH(listing.price, listing.listingID)
                  :
                  buyWithWBC(listing.price, listing.listingID)}
              >
                Buy with
                {listing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  ' ETH'
                  :
                  ' ' + tokenSymbol
                }
              </button> */}

            </div>
          )
        }
        )}
      </div>
    </section>
  )
}

export default BuyNFT
