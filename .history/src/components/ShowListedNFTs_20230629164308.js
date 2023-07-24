import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLocation } from 'react-router-dom';
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { BidOnNFT, PurchaseNFT } from './'

const ShowListedNFTs = ({ listing, marketplaceContract, buyWithETH, buyWithWBC }) => {
    const { ETHEREUM_NULL_ADDRESS } = useContext(MarketplaceContext);
    console.log('Entered ShowListedNFTs with listingID of ', listing.listingID)
    const location = useLocation();
    const path = location.pathname;
    const [nftData, setNftData] = useState(null);

    const { listingID, nftContractAddress, owner, price, paymentContractAddress, tokenID } = listing;
    const nftPrice = ethers.utils.formatEther(price);

    console.log('paymentContractAddress', paymentContractAddress);
    console.log('tokenID', tokenID);
    const { contract: nftContract } = useContract(nftContractAddress);
    const { data: nftContractName } = useContractRead(nftContract, "name");
    const { contract: tokenContract } = useContract(paymentContractAddress === ETHEREUM_NULL_ADDRESS ? null : paymentContractAddress);
    const { data: tokenSymbol } = useContractRead(tokenContract, "symbol");
    const { data: nft } = useContractRead(nftContract, "tokenURI", [tokenID >= 0 ? tokenID : 0]);
    useEffect(() => {
        const ipfsUrl = (ipfsUrl) => {
            if (!ipfsUrl) return '';
            // Convert the ipfs URL to a HTTP URL
            return `https://ipfs.io/ipfs/${ipfsUrl.split('ipfs://')[1]}`;
        };

        const fetchNftData = async () => {
            if (!nft || tokenID === null || tokenID === undefined) return;
            const url = ipfsUrl(nft);
            const response = await fetch(url);
            const json = await response.json();
            setNftData(json);
            console.log('nftData', nftData)
        };

        fetchNftData();
    }, [nft, tokenID]);
    return (
        <div className='listed-nft__flex'>

            {path === '/buy_nft' && nftData &&
                <>
                    <PurchaseNFT buyWithETH={buyWithETH} buyWithWBC={buyWithWBC} listingID={listingID} price={price} tokenSymbol={tokenSymbol} paymentContractAddress={paymentContractAddress} />
                    <span>Listing ID: {listingID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{tokenID + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}>{nftData.name}</a></span>
                    <span>Price: {
                        paymentContractAddress === ETHEREUM_NULL_ADDRESS
                            ?
                            nftPrice + ' ETH'
                            :
                            nftPrice + ' ' + tokenSymbol

                    }</span>
                    <span>Sold By: {owner}</span>

                </>
            }
            {path === '/view_auctions' && nftData &&
                <>
                    <BidOnNFTPayment buyWithETH={buyWithETH} buyWithWBC={buyWithWBC} listingID={listingID} price={price} tokenSymbol={tokenSymbol} paymentContractAddress={paymentContractAddress} />
                    <span>Auction ID: {listingID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{tokenID + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}>{nftData.name}</a></span>
                    <span>Price: {
                        paymentContractAddress === ETHEREUM_NULL_ADDRESS
                            ?
                            nftPrice + ' ETH'
                            :
                            nftPrice + ' ' + tokenSymbol

                    }</span>
                    <span>Sold By: {owner}</span>


                </>
            }
        </div>
    )
}

export default ShowListedNFTs
