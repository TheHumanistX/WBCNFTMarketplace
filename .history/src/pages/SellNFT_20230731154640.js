import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useEthers, useMarketplace, useNFT, useToken } from '../context'
import { AlertModal, AuctionSalesManagementButton, ShowOwnedNFTs } from '../components';
import { useCheckAuctionCollectSalesCancel, useOwnedNFTs } from '../hooks';
import { listNFT } from '../utility';


const SellNFT = () => {
  console.log('SellNFT rendered');

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
  const [listingCurrency, setListingCurrency] = useState('ETH');
  const [txConfirm, setTxConfirm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [displayButton, setDisplayButton] = useState(false);

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(setDisplayButton);

  const ownedNFTs = useOwnedNFTs(txConfirm);

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

  const handleListNFTForSale = async (listingDetails) => {
    let approval;
    const price = listingDetails.price;
    const priceInWei = ethers.utils.parseEther(price);
    const tokenId = listingDetails.tokenId;
    if (isNaN(price) || price === '' || price <= 0) {
      setIsOpen(true);
      setModalText('Please enter a valid price amount.');
      return;
    }
    if (listingCurrency === 'ETH') {
      // convert price to wei
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      try {
        await listNFT({
          approval,
          setTxConfirm,
          marketplaceContract,
          nftContractAddress,
          tokenId,
          priceInWei,
          listingCurrency
        });
      } catch (err) {
        console.error("contract call failure", err);
      }
    } else {
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      try {
        await listNFT({
          approval,
          setTxConfirm,
          marketplaceContract,
          nftContractAddress,
          tokenContractAddress,
          tokenId,
          priceInWei,
          listingCurrency
        });
      } catch (err) {
        console.error("contract call failure", err);
      }
    }
  }
  return (
    <section className='sellNFT__container'>
      {displayButton && (
        <AuctionSalesManagementButton
          activeSales={activeSales}
          expiredAuctions={expiredAuctions}
          wonAuctions={wonAuctions}
          setDisplayButton={setDisplayButton}
        />
      )}
      <h1>LIST YOUR NFT</h1>
      <SubmitNFTContractAddress setNFTContractAddress={setNFTContractAddress} />
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
