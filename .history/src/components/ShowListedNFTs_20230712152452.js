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
        lastNFTMintedId

    } = useContext(MarketplaceContext);
    const [tokenSymbol, setTokenSymbol] = useState('');
    const { ETHEREUM_NULL_ADDRESS } = useContext(MarketplaceContext);
    console.log('Entered ShowListedNFTs with listingID of ', listing.auctionID)
    console.log('Entered ShowListedNFTs with listing: ', listing)
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
    const getTokenSymbol = async () => {
        try {
            const tokenSymbolFromContract = currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS ? 'ETH' : await tokenContract.call('symbol');
            setTokenSymbol(tokenSymbolFromContract);
        } catch (error) {
            console.error('Error getting token symbol:', error);
        }
    }
    
    useEffect(() => {
        getTokenSymbol();
    }, [JSON.stringify(currentListing), tokenContract]);
    console.log('ShowListedNFTs tokenSymbol: ', tokenSymbol);
    const { data: nft } = useContractRead(nftContract, "tokenURI", [currentListing.tokenId >= 0 ? currentListing.tokenId : 0]);
    console.log('ShowListedNFTs nft:', nft ? nft : '')
    const nftData = useFetchNftData(nft, currentListing.tokenId);
    console.log('ShowListedNFTs nftData: ', nftData)
    console.log('currentListing.minBidIncrement: ', currentListing.minBidIncrement)
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
            }
            {
                path === '/view_auctions' && nftData &&
                <div className='showListedNFT__container'>
                    {console.log('ShowListedNFTs currentBid: ', currentListing.formattedCurrentBid)}
                    {console.log('ShowListedNFTs minBidIncrement: ', currentListing.formattedMinBidIncrement)}
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
