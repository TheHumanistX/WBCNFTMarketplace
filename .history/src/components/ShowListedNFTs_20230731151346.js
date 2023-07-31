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

    useEffect(() => {
      setNFTContractAddress(currentListing.nftContractAddress);
    }, [currentListing, setNFTContractAddress]);
    
    const nftData = useFetchNftData(nftContract, currentListing.tokenId);
    if (!nftData) return null;


    return (
        <>
            {path === '/buy_nft' ? (
                <div className='showListedNFT__container'>
                    <NFTImage />
                    <NFTMeta />
                    <div className='nft-listing__data'>
                        // Remainder of code here...
                    </div>
                </div>
            ) : (
                <div className='showListedNFT__container'>
                    <NFTImage />
                    <NFTMeta />
                    <div className='nft-listing__data'>
                        // Remainder of code here...
                    </div>
                </div>
            )}
        </>
    )
}

export default ShowListedNFTs
