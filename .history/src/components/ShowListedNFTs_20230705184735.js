import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { BidOnNFT, PurchaseNFT, TimeRemaining } from './'
import { useFetchNftData, useListing } from '../hooks/';

const ShowListedNFTs = ({ listing, marketplaceContract, buyWithETH, buyWithWBC, bidWithETH, bidWithWBC }) => {
    const {
        nftContractAddress,
        
    } = useContext(MarketplaceContext);
    const { ETHEREUM_NULL_ADDRESS } = useContext(MarketplaceContext);
    console.log('Entered ShowListedNFTs with listingID of ', listing.auctionID)
    const location = useLocation();
    const path = location.pathname;
    const currentListing = useListing(listing);
    // const { listingID, nftContractAddress, owner, price, paymentContractAddress, tokenID: tokenId } = listing;
    
    console.log('currentListing: ', currentListing)
    console.log('currentListing.paymentContractAddress', currentListing.paymentContractAddress);
    console.log('currentListing.tokenId', currentListing.tokenId);
    const { data: nftContract } = useContract(currentListing.nftContractAddress)
    const { data: nftContractName } = useContractRead(nftContract, "name");
    const { contract: tokenContract } = useContract(currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS ? null : currentListing.paymentContractAddress);
    const { data: tokenSymbol } = useContractRead(tokenContract, "symbol");
    const { data: nft } = useContractRead(nftContract, "tokenURI", [currentListing.tokenId >= 0 ? currentListing.tokenId : 0]);
    
    const nftData = useFetchNftData(nft, currentListing.tokenId);
    console.log('currentListing.formattedInitialBid: ', currentListing.formattedInitialBid)
    return (
        <div className='listed-nft__flex'>

            {path === '/buy_nft' && nftData &&
                <div className='showListedNFT__container'>
                    <span>Listing ID: {currentListing.listingID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (currentListing.tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{currentListing.tokenId + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (currentListing.tokenId)}>{nftData.name}</a></span>
                    <span>Price: {
                        currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                        ?
                        currentListing.formattedPrice + ' ETH'
                        :
                        currentListing.formattedPrice + ' ' + tokenSymbol
                        
                    }</span>
                    <span>Sold By: {currentListing.owner}</span>
                    <PurchaseNFT buyWithETH={buyWithETH} buyWithWBC={buyWithWBC} listingID={currentListing.listingID} price={currentListing.price} tokenSymbol={tokenSymbol} paymentContractAddress={currentListing.paymentContractAddress} />

                </div>
            }
            {path === '/view_auctions' && nftData &&
                <div className='showListedNFT__container'>
                    <span>Auction ID: {currentListing.auctionID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (currentListing.tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{currentListing.tokenId + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (currentListing.tokenId)}>{nftData.name}</a></span>
                    <span>Initial Bid: {
                        currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                        ?
                        currentListing.formattedInitialBid + ' ETH'
                        :
                        currentListing.formattedInitialBid + ' ' + tokenSymbol

                    }</span>
                    <span>Minimum Bid Increments: {
                        currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                        ?
                        currentListing.formattedMinBidIncrement + ' ETH'
                        :
                        currentListing.formattedMinBidIncrement + ' ' + tokenSymbol
                        
                    }</span>
                    <span>Current Bid: {
                        currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                        ?
                        currentListing.formattedCurrentBid + ' ETH'
                        :
                        currentListing.formattedCurrentBid + ' ' + tokenSymbol
                        
                    }</span>
                    <span>Expiration Date: {currentListing.formattedExpiration}</span>
                    <span>Time Remaining: <TimeRemaining expiration={currentListing.expiration} /></span>
                    <span>Sold By: {currentListing.owner}</span>
                    <BidOnNFT bidWithETH={bidWithETH} bidWithWBC={bidWithWBC} auctionID={currentListing.auctionID} minBidIncrement={currentListing.minBidIncrement} tokenSymbol={tokenSymbol} paymentContractAddress={currentListing.paymentContractAddress} />


                </div>
            }
        </div>
    )
}

export default ShowListedNFTs
