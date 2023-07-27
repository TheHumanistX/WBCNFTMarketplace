import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useContract, useContractEvents } from '@thirdweb-dev/react'
import { ShowListedNFTs } from './'
import marketplaceABI from '../ABI/marketplaceABI.json'

const BuyNFT = () => {

  const [liveListings, setLiveListings] = useState([{}]);
  const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  console.log("contract", marketplaceContract);
  // const { data } = useContractEvents(marketplaceContract, "ListingCreated");
  // console.log("NFT Listings: ", data)

  useEffect(() => {
    const fetchEvents = async () => {
      if (!marketplaceContract) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
      const contract = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
      const filter = contract.filters.ListingCreated(); 
      await provider.send("eth_requestAccounts", [])

      const logs = await provider.getLogs({
        fromBlock: 9244156,
        toBlock: "latest",
        address: contract.address,
        topics: filter.topics,
      });
      const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
      const currentListings = parsedLogs ? parsedLogs.map((log) => ({[log.args.listingID.toNumber()] : log.args.tokenID.toNumber()})) : '';
      setLiveListings(currentListings.slice(0, 5));
      
    };

    fetchEvents();
  }, [marketplaceABI, marketplaceContract]);


  return (
    <section className='buynft__container'>
      <h1>Buy An NFT!</h1>
      <h3>There are {liveListings.length} NFTs listed for sale!</h3>
      {liveListings && liveListings.map((listing, index) => {
            return (
                <div key={index}>
                <span>Listing ID: {listing.listingID}</span>
                <ShowListedNFTs liveListings={listing.tokenID} marketplaceContract={marketplaceContract} />
                
                </div>
            )
        }
      )}
      {console.log('liveListings', liveListings ? liveListings : '')}
    </section>
  )
}

export default BuyNFT
