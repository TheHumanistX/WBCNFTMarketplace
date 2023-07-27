import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { useEthers, useMarketplace, useToken } from '../context';
import { ShowListedNFTs } from '../components'

const BuyNFT = () => {
  const { ETHEREUM_NULL_ADDRESS } = useEthers();    
  const { tokenContract } = useToken();
  const { 
    marketplaceContractAddress,
    marketplaceContract,
    marketplaceNFTListedEvents,
  } = useMarketplace();

  const [liveListings, setLiveListings] = useState([]);
  const [listingStatuses, setListingStatuses] = useState({});
  const [txConfirm, setTxConfirm ] = useState(null);
  
  const { data: tokenSymbol } = useContractRead(tokenContract, 'symbol');
  const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  const { mutateAsync: buyERC20NFT } = useContractWrite(marketplaceContract, "buyERC20NFT")

  useEffect(() => {
    
    if (!marketplaceNFTListedEvents) {
      console.log('No ListingCreated events...')
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
        formattedPrice: ethers.utils.formatEther(event.data.price),
        paymentMethodSymbol: event.data.paymentContract === ETHEREUM_NULL_ADDRESS ? 'ETH' : 'WBC',
        paymentContractAddress: event.data.paymentContract,
        tokenID: event.data.tokenID.toNumber(),
      }));
      
      console.log('currentListings: ', currentListings)
      // Fetch the status for each listing
      const listingStatuses = await Promise.all(
        currentListings.map((listing) =>
          marketplaceContract.call('getListingStatus', [listing.listingID])

        )
      );

      // Filter the current listings by status
      const activeListings = currentListings.filter(
        (listing, i) => listingStatuses[i] === 1
      );
  
      // Set the active listings in state
      setLiveListings(activeListings);
    };
  
    fetchEvents();
  }, [marketplaceContract, marketplaceNFTListedEvents, txConfirm]);

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
        console.log('Buying with ERC20...')
        const transaction = await buyERC20NFT({ args: [listingID] });
        if (transaction.receipt.status === 1) {
          console.info("contract call successs", transaction);
          setTxConfirm(transaction.receipt.blockHash);
          } else {
            console.error("Transaction failed");
          }
      } catch (err) {
        console.error("contract call failure", err);
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
        console.info("contract call successs", transaction  );
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
