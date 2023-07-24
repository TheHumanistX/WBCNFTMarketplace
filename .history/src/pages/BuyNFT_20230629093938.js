import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useContractEvents, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ShowListedNFTs } from '../components'
import marketplaceABI from '../ABI/marketplaceABI.json'

const BuyNFT = () => {
  const {
    marketplaceContractAddress,
    marketplaceContract,
    marketplaceNFTListedEvents,
    tokenContract,
  } = useContext(MarketplaceContext);

  const [liveListings, setLiveListings] = useState([]);
  const [listingStatuses, setListingStatuses] = useState({});
  // const marketplaceContractAddress = '0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA';
  // const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  // const tokenAddress = '0xFB29697113015019c42E90fdBC94d9B4898D2602';
  // const { contract: tokenContract } = useContract(tokenAddress);
  const { data: tokenSymbol } = useContractRead(tokenContract, 'symbol');
  const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  const { mutateAsync: buyNFT } = useContractWrite(marketplaceContract, "buyNFT")
  // console.log('walletAddress: ', walletAddress)
  // console.log("contract", marketplaceContract);
  // const { data: marketplaceNFTListedEvents } = useContractEvents(marketplaceContract, "ListingCreated");
  // const { data: nftListingStatus } = useContractRead(marketplaceContract, "getListingStatus");
  // console.log("NFT Listings: ", marketplaceNFTListedEvents)

  useEffect(() => {
    
    if (!marketplaceNFTListedEvents) {
      return;
    }
    console.log('marketplaceNFTListedEvents: ', marketplaceNFTListedEvents)
    const fetchEvents = async () => {

      console.log('Entered fetchEvents...');
      
      
     
  
      // Create the currentListings array as before
      const currentListings = marketplaceNFTListedEvents.map((event) => ({
        listingID: event.data.listingID.toNumber(),
        nftContractAddress: event.data.nftContract,
        owner: event.data.owner,
        price: event.data.price,
        ethPrice: ethers.utils.formatEther(event.data.price),
        tokenContractAddress: event.data.paymentContract,
        tokenID: event.data.tokenID.toNumber(),
      }));
      

      // Fetch the status for each listing
      const listingStatuses = await Promise.all(
        currentListings.map((listing) =>
          marketplaceContract.call('getListingStatus', [listing.listingID])

        )
      );
      // console.log('listingStatuses: ', listingStatuses)
      // console.log('currentListings: ', currentListings)
      // Filter the current listings by status
      const activeListings = currentListings.filter(
        (listing, i) => listingStatuses[i] === 1
      );
  
      // Set the active listings in state
      setLiveListings(activeListings);
     
    };
  
    fetchEvents();
  }, [marketplaceABI, marketplaceContract, marketplaceNFTListedEvents]);
  

 

  const buyWithWBC = async (listingPrice, listingID) => {
    let approval;
    // console.log('buyWithWBC listingID: ', listingID);
    try {
      approval = await approve({ args: [marketplaceContractAddress, listingPrice] });
      // console.log("wbc amount approval success", approval);
      // console.log("approval status", approval.receipt.status)
    } catch (err) {
      // console.log("wbc amount approval failure", err);
    }

    if (approval && approval.receipt.status === 1) {
      try {
        // console.log('Buying...')
        const transaction = await buyNFT({ args: [listingID] });
        // console.info("contract call successs", transaction);
      } catch (err) {
        // console.error("contract call failure", err);
      }
    }
  }

  const buyWithETH = async (listingPrice, listingID) => {
    try {
      console.log('Buying with ETH...')
      // console.log('listingPrice: ', listingPrice)

      // const ethAmount = ethers.utils.parseEther(listingPrice);
      const transaction = await buyNFT({ args: [listingID],  overrides: { value: listingPrice }});
      await transaction.wait(); // Wait for the transaction to be mined
      console.log('NFT bought with ETH');
    } catch (error) {
      console.error('Failed to buy NFT with ETH', error);
    }
  };

  return (
    <section className='buynft__container'>
      <h1>Buy An NFT!</h1>
      <div className='buynft__owned-grid'>
        {/* {console.log('Entering `liveListings` map function...')} */}
        {liveListings && liveListings.map((listing, index) => {
          return (
            <div key={index} className='listing-flex'>
              
              {/* {console.log('Entering ShowListedNFTs Component...')} */}

              <ShowListedNFTs listing={listing} marketplaceContract={marketplaceContract} />
                
              <button className='buynft__button' onClick={() =>
                listing.tokenContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  buyWithETH(listing.price, listing.listingID)
                  :
                  buyWithWBC(listing.price, listing.listingID)}
              >
                Buy with
                {listing.tokenContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  ' ETH'
                  :
                  ' ' + tokenSymbol
                }
              </button>
        
        
            </div>
          )
        }
        )}
      </div>
      {/* {console.log('liveListings', liveListings ? liveListings : '')} */}
    </section>
  )
}

export default BuyNFT
