import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAddress, useContract, useContractEvents, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { ShowListedNFTs } from './'
import marketplaceABI from '../ABI/marketplaceABI.json'

const BuyNFT = () => {

  const [liveListings, setLiveListings] = useState([]);
  const marketplaceContractAddress = '0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA';
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  const WBCContractAddress = '0xFB29697113015019c42E90fdBC94d9B4898D2602';
  const { contract: WBCContract } = useContract(WBCContractAddress);
  const { data: tokenSymbol } = useContractRead(WBCContract, 'symbol');
  const { mutateAsync: approve } = useContractWrite(WBCContract, "approve");
  const { mutateAsync: buyNFT } = useContractWrite(marketplaceContract, "buyNFT")
  const walletAddress = useAddress();
  // console.log('walletAddress: ', walletAddress)
  // console.log("contract", marketplaceContract);
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
      // console.log('parsed logs: ', parsedLogs ? parsedLogs : '');
      const currentListings = parsedLogs.map((log) => ({
        listingID: log.args.listingID.toNumber(),
        nftContractAddress: log.args.nftContract,
        owner: log.args.owner,
        price: log.args.price,
        tokenContractAddress: log.args.paymentContract,
        tokenID: log.args.tokenID.toNumber()
      }));
      setLiveListings(currentListings);
      // const currentListings = parsedLogs ? parsedLogs.map((log) => ({[log.args.listingID.toNumber()] : log.args.tokenID.toNumber()})) : '';
      // setLiveListings(currentListings.slice(0, 5));

    };

    fetchEvents();
  }, [marketplaceABI, marketplaceContract]);

  const buyWithWBC = async (listingPrice, listingID) => {
    let approval;
    console.log('buyWithWBC listingID: ', listingID);
    try {
      approval = await approve({ args: [marketplaceContractAddress, listingPrice] });
      console.log("wbc amount approval success", approval);
      console.log("approval status", approval.receipt.status)
    } catch (err) {
      console.log("wbc amount approval failure", err);
    }

    if (approval && approval.receipt.status === 1) {
      try {
        console.log('Buying...')
        const transaction = await buyNFT({ args: [listingID] });
        console.info("contract call successs", transaction);
      } catch (err) {
        console.error("contract call failure", err);
      }
    }
  }

  const buyWithETH = async (listingPrice, listingID) => {
    try {
      console.log('Buying with ETH...')
      console.log('listingPrice: ', listingPrice)
      
      
      const transaction = await buyNFT({ args: [listingID], value: listingPrice });
      await transaction.wait(); // Wait for the transaction to be mined
      console.log('NFT bought with ETH');
    } catch (error) {
      console.error('Failed to buy NFT with ETH', error);
    }
  };
  

  return (
    <section className='buynft__container'>
      <h1>Buy An NFT!</h1>
      <h3>There are {liveListings.length} NFTs listed for sale!</h3>
      <div className='buynft__owned-grid'>
        {liveListings && liveListings.map((listing, index) => {
          return (
            <div key={index}>
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
