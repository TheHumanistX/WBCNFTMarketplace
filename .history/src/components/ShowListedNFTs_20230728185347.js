import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useNFT, useToken } from '../context';
import { BidOnNFT, PurchaseNFT, TimeRemaining } from './'
import { useFetchNftData, useListing } from '../hooks/';

const ShowListedNFTs = ({ listing, buyWithETH, buyWithWBC, bidWithETH, bidWithWBC }) => {
    
    const location = useLocation();
    const path = location.pathname;
    const { ETHEREUM_NULL_ADDRESS } = useEthers();
    const { 
        nftContract,
        nftContractName,
        setNFTContractAddress
     } = useNFT();
    const { tokenSymbol } = useToken();
    const currentListing = useListing(listing);
    setNFTContractAddress(currentListing.nftContractAddress);
     console.log('ShowListedNFTs currentListing: ', currentListing)
    
    const nftData = useFetchNftData(nftContract, currentListing.tokenId);

    return (
        <>

            {path === '/buy_nft' && nftData &&
                <div className='showListedNFT__container'>
                    <div className='nft-listing__image'>
                        <span>Listing ID: {currentListing.listingID + 1}</span>
                        <a href={`https://testnets.opensea.io/assets/goerli/0xf94a9747c20076d56f84320acf36431dae557fb7/` + (currentListing.tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                        <span>{nftContractName} #{currentListing.tokenId + 1}</span>
                    </div>
                    <div className='nft-listing__meta'>
                        <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (currentListing.tokenId)}>{nftData.name}</a></span>
                        {nftData && nftData.attributes.map((attribute, index) => {

                            return (
                                <div key={index}>
                                    <span>{attribute.trait_type}: {attribute.value}</span>
                                </div>
                            )
                        }
                        )}
                    </div>
                    <div className='nft-listing__data'>
                        <div>
                        <span>Price: {
                            currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                                ?
                                currentListing.formattedPrice + ' ETH'
                                :
                                currentListing.formattedPrice + ' ' + tokenSymbol

                        }</span>
                        <span>Sold By: {currentListing.owner}</span>
                        <PurchaseNFT
                            buyWithETH={buyWithETH}
                            buyWithWBC={buyWithWBC}
                            listingID={currentListing.listingID}
                            price={currentListing.price}
                            tokenSymbol={tokenSymbol}
                            paymentContractAddress={currentListing.paymentContractAddress}
                        />
                        </div>
                    </div>
                </div>
            }
            {
                path === '/view_auctions' && nftData &&
                <div className='showListedNFT__container'>
                    <div className='nft-listing__image'>
                        <span>Auction ID: {currentListing.auctionID + 1}</span>
                        <a href={`https://testnets.opensea.io/assets/goerli/0xf94a9747c20076d56f84320acf36431dae557fb7/` + (currentListing.tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                        <span>{nftContractName} #{currentListing.tokenId + 1}</span>
                    </div>
                    <div className='nft-listing__meta'>
                        <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (currentListing.tokenId)}>{nftData.name}</a></span>
                        {nftData && nftData.attributes.map((attribute, index) => {

                            return (
                                <div key={index}>
                                    <span>{attribute.trait_type}: {attribute.value}</span>
                                </div>
                            )
                        }
                        )}
                    </div>
                    <div className='nft-listing__data'>
                        <div>
                            <span>Current Bid: {
                                currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                                    ?
                                    currentListing.formattedCurrentBid + ' ETH'
                                    :
                                    currentListing.formattedCurrentBid + ' ' + tokenSymbol

                            }</span>
                            <span>Minimum Bid Increments: {
                                currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                                    ?
                                    currentListing.formattedMinBidIncrement + ' ETH'
                                    :
                                    currentListing.formattedMinBidIncrement + ' ' + tokenSymbol

                            }</span>
                            <span>Expiration Date: {currentListing.formattedExpiration}</span>
                            <span>Time Remaining: <TimeRemaining expiration={currentListing.expiration} /></span>
                            <span>Sold By: {currentListing.owner}</span>
                            <BidOnNFT
                                bidWithETH={bidWithETH}
                                bidWithWBC={bidWithWBC}
                                auctionID={currentListing.auctionID}
                                minBidIncrement={currentListing.minBidIncrement}
                                formattedCurrentBid={currentListing.formattedCurrentBid}
                                formattedMinBidIncrement={currentListing.formattedMinBidIncrement}
                                tokenSymbol={tokenSymbol}
                                paymentContractAddress={currentListing.paymentContractAddress}
                            />
                        </div>
                    </div>


                </div>
            }
        </>
    )
}

export default ShowListedNFTs
