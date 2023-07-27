import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { BidOnNFT, PurchaseNFT } from './'
import { useFetchNftData, useListing } from '../hooks/';

const ShowListedNFTs = ({ listing, marketplaceContract, buyWithETH, buyWithWBC }) => {
    const {
        nftContractAddress,
        
    } = useContext(MarketplaceContext);
    const { ETHEREUM_NULL_ADDRESS } = useContext(MarketplaceContext);
    console.log('Entered ShowListedNFTs with listingID of ', listing.listingID)
    const location = useLocation();
    const path = location.pathname;
    const currentListing = useListing(listing);
    // const { listingID, nftContractAddress, owner, price, paymentContractAddress, tokenID: tokenId } = listing;
    

    console.log('currentListing.paymentContractAddress', currentListing.paymentContractAddress);
    console.log('currentListing.tokenId', currentListing.tokenId);
    const { data: nftContract } = useContract(currentListing.nftContractAddress)
    const { data: nftContractName } = useContractRead(nftContract, "name");
    const { contract: tokenContract } = useContract(currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS ? null : currentListing.paymentContractAddress);
    const { data: tokenSymbol } = useContractRead(tokenContract, "symbol");
    const { data: nft } = useContractRead(nftContract, "tokenURI", [currentListing.tokenId >= 0 ? currentListing.tokenId : 0]);
    
    const nftData = useFetchNftData(nft, currentListing.tokenId);

    return (
        <div className='listed-nft__flex'>

            {path === '/buy_nft' && nftData &&
                <>
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

                </>
            }
            {/* {path === '/view_auctions' && nftData &&
                <>
                    <BidOnNFTPayment buyWithETH={buyWithETH} buyWithWBC={buyWithWBC} listingID={listingID} price={price} tokenSymbol={tokenSymbol} paymentContractAddress={paymentContractAddress} />
                    <span>Auction ID: {listingID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{tokenId + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenId)}>{nftData.name}</a></span>
                    <span>Price: {
                        paymentContractAddress === ETHEREUM_NULL_ADDRESS
                            ?
                            nftPrice + ' ETH'
                            :
                            nftPrice + ' ' + tokenSymbol

                    }</span>
                    <span>Sold By: {owner}</span>


                </>
            } */}
        </div>
    )
}

export default ShowListedNFTs
