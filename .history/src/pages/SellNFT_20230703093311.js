import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractWrite } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ShowOwnedNFTs } from '../components';
import { useOwnedNFTs, useUsersActiveListings } from '../hooks';


const SellNFT = () => {
  console.log('SellNFT rendered');

  const { 
    approveNFTTransfer, 
    marketplaceContractAddress, 
    marketplaceContract, 
    marketplaceNFTListedEvents, 
    marketplaceAuctionCreatedEvents,
    nftContractAddress, 
    nftContract, 
    nftContractName, 
    nftTransferEvents, 
    setNFTContractAddress, 
    lastNFTMintedId,
    tokenAddress,
    userWalletAddress 
  } = useContext(MarketplaceContext);
  
  const [saleCurrency, setListingCurrency] = useState('ETH');
  const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")

  const ownedNFTs = useOwnedNFTs(lastNFTMintedId, nftContract, marketplaceContract, userWalletAddress);
  // const usersActiveListings = useUsersActiveListings(marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents);
  console.log("usersActiveListings: ", usersActiveListings)
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setNFTContractAddress(e.target.nftContractAddress.value);
  }

  const handleApprove = async (marketplaceContractAddress, tokenId) => {
    // console.log('handleApprove tokenId: ', tokenId)
    let approval;
    try {
      approval = await approveNFTTransfer({ args: [marketplaceContractAddress, tokenId] });
      console.info("contract call successs", approval);
      return approval;
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const handleListNFTForSale = async (e) => {
    e.preventDefault();
    let approval;
    const price = e.target.price.value;
    const tokenId = Number(e.target.tokenId.value);
    if (saleCurrency === 'ETH') {
      // conver price to wei
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      // console.log('Selling for ', price, ' ', saleCurrency)
      // console.log('Selling price in wei: ', priceInWei)
      if (approval && approval.receipt.status === 1) {
        try {
          const data = await createListing({ args: [nftContractAddress, tokenId, priceInWei] });
          console.info("contract call successs", data);
        } catch (err) {
          console.error("contract call failure", err);
        }
      }
    } else {
      const price = e.target.price.value;
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      // console.log('Selling for ', price, ' ', saleCurrency);
      // console.log('Selling price in wei: ', priceInWei)
      if (approval && approval.receipt.status === 1) {
        try {
          const data = await createListing({ args: [nftContractAddress, tokenAddress, tokenId, priceInWei] });
          console.info("contract call successs", data);
        } catch (err) {
          console.error("contract call failure", err);
        }
      }
    }
  }
  return (
    <section className='sellNFT__container'>
      <h1>LIST YOUR NFT</h1>
      <form onSubmit={handleSubmit} className='sellNFT__contract-form'>
        <label>CONTRACT ADDRESS</label>
        <input type='text' id='nftContractAddress' placeholder='Contract Address' />
        <input type='submit' value='Submit' />
      </form>
      <span>You currently hold {ownedNFTs ? ownedNFTs.length : '0'} NFTs from the {nftContractName ? nftContractName : ''} contract.</span>
      <span>IDs of currently held nfts are: {
        ownedNFTs &&
        ownedNFTs.map((tokenId, index) => {
          if (index === ownedNFTs.length - 1) {
            return (
              <span key={index}>{tokenId}</span>
            )
          }
          return (
            <span key={index}>{tokenId}, </span>
          )
        })
      }</span>
      <div className='sellnft__owned-grid'>
        {ownedNFTs && ownedNFTs.map((tokenId) => {
          return (<ShowOwnedNFTs
            tokenId={tokenId}
            onListingSubmission={handleListNFTForSale}
            setListingCurrency={setListingCurrency}
          />)
        }
        )}
      </div>
    </section>
  )
}

export default SellNFT
