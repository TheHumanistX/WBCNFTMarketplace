import React, { useContext, useEffect, useState } from 'react'
import { useAddress, useContract, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ShowOwnedNFTs } from '../components'
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const CreateAuction = () => {

    const { 
        approveNFTTransfer, 
        createListing, 
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
        tokenAddress,
        userNFTBalance, 
        userWalletAddress 
      } = useContext(MarketplaceContext);
  
  const [saleCurrency, setSaleCurrency] = useState('ETH');

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setNFTContractAddress(e.target.nftContractAddress.value);
  }

  const { data: contractName } = useContractRead(nftContract, "name");
  const { mutateAsync: approve } = useContractWrite(nftContract, "approve")

  useEffect(() => {

    if (!nftTransferEvents || !marketplaceNFTListedEvents) {
      return; // if there's no contract address, exit early
    }

    const fetchEvents = async () => {

      console.log('Entered fetchEvents....')

      let tokenIdsOwnedByWallet = Object.values(nftTransferEvents)
        .filter(event => event.data.to.toLowerCase() === userWalletAddress.toLowerCase())
        .map(event => event.data.tokenId.toNumber());

      let tokenIdsForCreatedListings = Object.values(marketplaceNFTListedEvents)
        .filter(event => event.data.owner.toLowerCase() === userWalletAddress.toLowerCase())
        .map(event => event.data.tokenID.toNumber());

      // console.log('tokenIdsForCreatedListings: ', tokenIdsForCreatedListings);

      // remove any tokenId from tokenIdsOwnedByWallet that is also in tokenIdsForCreatedListings
      
      tokenIdsOwnedByWallet = tokenIdsOwnedByWallet.filter(tokenId => !tokenIdsForCreatedListings.includes(tokenId));

      // This line converts the tokenIdsOwnedByWallet into a Set. Sets only allow unique values, so this gets rid of the 
      // potential for any duplicate values. Then, by wrapping it in [ ], we convert it BACK to an array.

      tokenIdsOwnedByWallet = [...new Set(tokenIdsOwnedByWallet)];
      setOwnedNFTs(tokenIdsOwnedByWallet);
    };
    fetchEvents();
  }, [ marketplaceNFTListedEvents, nftContract, nftTransferEvents, userWalletAddress]);

  const handleApprove = async (marketplaceContractAddress, tokenId) => {
    console.log('handleApprove tokenId: ', tokenId)
    let approval;
    try {
      approval = await approve({ args: [marketplaceContractAddress, tokenId] });
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
    if (saleCurrency == 'ETH') {
      // conver price to wei
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      
      console.log('Selling for ', price, ' ', saleCurrency)
      console.log('Selling price in wei: ', priceInWei)
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
      console.log('Selling for ', price, ' ', saleCurrency)
      console.log('Selling price in wei: ', priceInWei)
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
      <span>You currently hold {userNFTBalance ? userNFTBalance.toNumber() : '0'} NFTs from the {contractName ? contractName : ''} contract.</span>
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
            nftContractAddress={nftContractAddress}
            nftContract={nftContract}
            tokenId={tokenId}
            handleListNFTForSale={handleListNFTForSale}
            setSaleCurrency={setSaleCurrency}
          />)

        }
        )}
      </div>
    </section>
  )
}

export default CreateAuction