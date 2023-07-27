import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useEthers, useMarketplace, useNFT, useToken } from '../context'
import { AlertModal, ShowOwnedNFTs } from '../components';
import { useOwnedNFTs } from '../hooks';
import { listNFT } from '../utility';


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
    nftContract,
    nftContractAddress,
    nftContractName,
    setNFTContractAddress,
  } = useNFT();

  const { tokenContractAddress } = useToken();

  // Initialize state variables
  const [saleCurrency, setListingCurrency] = useState('ETH');
  const [txConfirm, setTxConfirm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  // const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")

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
    if (isNaN(price) || price === '') {
      setIsOpen(true);
      setModalText('Please enter a valid price amount.');
      return;
    }
    if (saleCurrency === 'ETH') {
      // convert price to wei
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      try {
        await listNFT({ setTxConfirm, marketplaceContract, nftContractAddress, tokenId, priceInWei, saleCurrency });
      } catch (err) {
        console.error("contract call failure", err);
      }
    } else {
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      try {
        await listNFT({ setTxConfirm, marketplaceContract, nftContractAddress, tokenContractAddress, tokenId, priceInWei, saleCurrency });
      } catch (err) {
        console.error("contract call failure", err);
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
      <AlertModal open={isOpen} onClose={() => setIsOpen(false)}>
        {modalText}
      </AlertModal>
    </section>
  )
}

export default SellNFT
