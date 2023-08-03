import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useEthers, useNFT, useToken } from '../context';
import { BidOnNFT, PurchaseNFT, TimeRemaining } from './'
import { useFetchNftData, useListing } from '../hooks/';


const NFTImage = ({ path, currentListing, nftData, nftContractName }) => (
    <div className='nft-listing__image'>
        <span>{path === '/buy_nft' ? "Listing" : "Auction"} ID: {path === '/buy_nft' ? currentListing.listingID + 1 : currentListing.auctionID + 1}</span>
        <a href={`https://testnets.opensea.io/assets/goerli/0xf94a9747c20076d56f84320acf36431dae557fb7/${currentListing.tokenId}`}>
            <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' />
        </a>
        <span>{nftContractName} #{currentListing.tokenId + 1}</span>
    </div>
);

const NFTMeta = ({ nftData, nftContract, currentListing }) => (
    <div className='nft-listing__meta'>
        <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/${currentListing.tokenId}`}>{nftData.name}</a></span>
        {nftData && nftData.attributes.map((attribute, index) => (
            <div key={index}>
                <span>{attribute.trait_type}: {attribute.value}</span>
            </div>
        ))}
    </div>
);


const ShowListedNFTs = ({ listing, buyWithETH, buyWithWBC, bidWithETH, bidWithWBC, timerComplete, setTimerComplete }) => {

    const location = useLocation();
    const path = location.pathname;
    const { ETHEREUM_NULL_ADDRESS } = useEthers();
    const {
        nftContract,
        nftContractName,
        setNFTContractAddress,
        nftContractAddress
    } = useNFT();
    const { tokenSymbol } = useToken();
    const currentListing = useListing(listing);
    const listingOwner = currentListing.owner.slice(0, 6) + '...' + currentListing.owner.slice(-4);
    useEffect(() => {
        setNFTContractAddress(currentListing.nftContractAddress);
    }, [currentListing, nftContractAddress]);

    const nftData = useFetchNftData(nftContract, currentListing.tokenId);
    if (!nftData) return null;

    const commonProps = {
        path,
        currentListing,
        nftData,
        nftContractName
    };

    return (
        <>
            {path === '/buy_nft' ? (
                <div className='showListedNFT__container'>
                    <NFTImage {...commonProps} />
                    <NFTMeta {...commonProps} nftContract={nftContract} />
                    <div className='nft-listing__data buy'>
                        <div className='nft-listing__data-row1 buy'>
                            <span>Price: </span>
                            <span>
                            {
                                currentListing.paymentContractAddress === ETHEREUM_NULL_ADDRESS
                                    ?
                                    currentListing.formattedPrice + ' ETH'
                                    :
                                    currentListing.formattedPrice + ' ' + tokenSymbol

                            }
                            </span>
                        </div>
                        <div className='nft-listing__data-row2 buy'>
                            <span>Sold By:</span> <span><a href={`https://goerli.etherscan.io/address/${currentListing.owner}`}>{listingOwner}</a></span>
                            </div>
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
            ) : (
                <div className='showListedNFT__container'>
                    <NFTImage {...commonProps} />
                    <NFTMeta {...commonProps} nftContract={nftContract} />
                    <div className='nft-listing__data'>
                        <div className='nft-listing__data-row1'>
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
                        </div>
                        <div className='nft-listing__data-row2'>
                            <span>Expiration Date:</span> <span>{currentListing.formattedExpiration}</span>
                        </div>
                        <div className='nft-listing__data-row3'>
                            <span>Time Remaining:</span><span><TimeRemaining expiration={currentListing.expiration} timerComplete={timerComplete} setTimerComplete={setTimerComplete} /></span>
                        </div>
                        <div className='nft-listing__data-row4'>
                            <span>Sold By:</span> <span><a href={`https://goerli.etherscan.io/address/${currentListing.owner}`}>{listingOwner}</a></span>
                        </div>
                        <BidOnNFT
                            bidWithETH={bidWithETH}
                            bidWithWBC={bidWithWBC}
                            auctionID={currentListing.auctionID}
                            minBidIncrement={currentListing.minBidIncrement}
                            formattedCurrentBid={currentListing.formattedCurrentBid}
                            formattedMinBidIncrement={currentListing.formattedMinBidIncrement}
                            tokenSymbol={tokenSymbol}
                            paymentContractAddress={currentListing.paymentContractAddress}
                            auctionExpiration={currentListing.expiration}
                        />

                    </div>
                </div>
            )}
        </>
    )
}

export default ShowListedNFTs
