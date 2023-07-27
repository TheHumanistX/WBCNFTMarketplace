import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractWrite } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { useEthers, useMarketplace, useNFT, useToken } from '../context'
import { ShowOwnedNFTs } from '../components';
import { useOwnedNFTs, useUsersActiveListings } from '../hooks';


const SellNFT = () => {
  console.log('SellNFT rendered');

  // const {
  //   approveNFTTransfer, //! Need to figure out what I am doing with the approve 
  //   marketplaceNFTListedEvents,
  //   marketplaceAuctionCreatedEvents,
  //   nftTransferEvents,
  // } = useContext(MarketplaceContext);

  // Import necessary context data for this component

  const {
    marketplaceContractAddress,
    marketplaceContract,
  } = useMarketplace();

  const {
    nftContractAddress,
    nftContractName,
    setNFTContractAddress,
  } = useNFT();

  const { tokenContractAddress } = useToken();

  // Initialize state variables
  const [saleCurrency, setListingCurrency] = useState('ETH');
  const [txConfirm, setTxConfirm] = useState('');
  const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")

  const ownedNFTs = useOwnedNFTs(txConfirm);
  // const usersActiveListings = useUsersActiveListings(marketplaceContract, userWalletAddress, marketplaceNFTListedEvents, marketplaceAuctionCreatedEvents);
  // console.log("usersActiveListings: ", usersActiveListings)
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setNFTContractAddress(e.target.nftContractAddress.value);
  }

  const handleApprove = async (marketplaceContractAddress, tokenId) => {
    // console.log('handleApprove tokenId: ', tokenId)
    try {
      const approvalResponse = await nftContract.approve(marketplaceContractAddress, tokenId);
      const approvalReceipt = await approvalResponse.wait();
      console.info("Contract call successs", approvalReceipt);
      console.log("Approval status", approvalReceipt.status);
      return approvalReceipt;
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
          const transactionResponse = await marketplaceContract.createListing(nftContractAddress, tokenId, priceInWei);
          const transactionReceipt = await transactionResponse.wait();
          console.info("Contract call successs", approvalReceipt);
          console.log("Transaction status", transactionReceipt.status);
          if (transactionReceipt.status === 1) {
            console.info("contract call successs", transaction);
            setTxConfirm(transaction.receipt.blockHash);
          } else {
            console.error("Transaction failed");
          }
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
          const transaction = await createListing({ args: [nftContractAddress, tokenContractAddress, tokenId, priceInWei] });
          console.log('transaction: ', transaction)
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
