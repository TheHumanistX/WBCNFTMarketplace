import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractWrite } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ShowOwnedNFTs } from '../components';


const SellNFT = () => {
  console.log('SellNFT rendered');

  const { 
    approveNFTTransfer, 
    marketplaceContractAddress, 
    marketplaceContract, 
    marketplaceNFTListedEvents, 
    nftContractAddress, 
    nftContract, 
    nftContractName, 
    nftTransferEvents, 
    setNFTContractAddress, 
    ownedNFTs, 
    setOwnedNFTs, 
    lastNFTMintedId,
    tokenAddress,
    userWalletAddress 
  } = useContext(MarketplaceContext);
  
  const [saleCurrency, setListingCurrency] = useState('ETH');
  const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")
  
  // console.log('nftTransferEvents', nftTransferEvents ? nftTransferEvents[0].data.tokenId.toNumber() : '');
  // console.log('nftTransferEvents type: ', typeof (nftTransferEvents))
  // console.log('listingCreated: ', marketplaceNFTListedEvents ? marketplaceNFTListedEvents[0].data.tokenID.toNumber() : '');

  useEffect(() => {
    if (!userWalletAddress || !nftContract) {
      return;
    }

    const fetchNFTs = async () => {
      const tokenIdsOwnedByWallet = [];
      const numberOfListings = marketplaceNFTListedEvents.length;
      console.log('numberOfListings: ', numberOfListings)
      for (let i = 1; i <= numberOfListings; i++) {
        const listing = await marketplaceContract.call("getListing", [i]);
        console.log('listing: ', listing)
        console.log('listing.status: ', listing.status)')
        if (listing.owner.toLowerCase() === userWalletAddress.toLowerCase()) {
          if (listing.status !== "ACTIVE") {
            tokenIdsOwnedByWallet.push(listing.tokenID);
          }
        }
      }

      setOwnedNFTs(tokenIdsOwnedByWallet);
    };

    fetchNFTs();
}, [nftContract, marketplaceContract, userWalletAddress, marketplaceNFTListedEvents]);



  // useEffect(() => {

  //   if (!nftTransferEvents || !marketplaceNFTListedEvents) {
  //     return; 
  //   }

  //   const fetchEvents = async () => {

  //     if (!userWalletAddress) {
  //       return;
  //     }
  //     console.log('Entered fetchEvents....')

  //     let tokenIdsOwnedByWallet = Object.values(nftTransferEvents)
  //       .filter(event => event.data.to.toLowerCase() === userWalletAddress.toLowerCase())
  //       .map(event => event.data.tokenId.toNumber());
  //     console.log('tokenIdsOwnedByWallet: ', tokenIdsOwnedByWallet)
  //     let tokenIdsForCreatedListings = Object.values(marketplaceNFTListedEvents)
  //       .filter(event => event.data.owner.toLowerCase() === userWalletAddress.toLowerCase())
  //       .map(event => event.data.tokenID.toNumber());

  //     console.log('tokenIdsForCreatedListings: ', tokenIdsForCreatedListings);

  //     // remove any tokenId from tokenIdsOwnedByWallet that is also in tokenIdsForCreatedListings
      
  //     tokenIdsOwnedByWallet = tokenIdsOwnedByWallet.filter(tokenId => !tokenIdsForCreatedListings.includes(tokenId));

  //     // This line converts the tokenIdsOwnedByWallet into a Set. Sets only allow unique values, so this gets rid of the 
  //     // potential for any duplicate values. Then, by wrapping it in [ ], we convert it BACK to an array.

  //     tokenIdsOwnedByWallet = [...new Set(tokenIdsOwnedByWallet)];
  //     setOwnedNFTs(tokenIdsOwnedByWallet);
  //   };
  //   fetchEvents();
  // }, [ marketplaceNFTListedEvents, nftContract, nftTransferEvents, userWalletAddress]);

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
