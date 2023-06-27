import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContract, useContractRead } from '@thirdweb-dev/react';

const ShowListedNFTs = ({ listing, marketplaceContract }) => {
    const [nftData, setNftData] = useState(null);
    const { listingID, nftContractAddress, owner, price, tokenContractAddress, tokenID } = listing;
    const nftPrice = ethers.utils.formatEther(price);
    // console.log('listingID', listingID);
    // console.log('nftContractAddress', nftContractAddress + ' ' + typeof (nftContractAddress));
    // console.log('owner', owner);
    // console.log('nftPrice', nftPrice);
    console.log('tokenContractAddress', tokenContractAddress);
    console.log('tokenID', tokenID);
    const { contract: nftContract } = useContract(nftContractAddress);
    const { data: nftContractName } = useContractRead(nftContract, "name");
    const { contract: tokenContract } = useContract(tokenContractAddress === '0x0000000000000000000000000000000000000000' ? null : tokenContractAddress);
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
            {nftData &&
                <>
                    <span>Listing ID: {listingID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{tokenID + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}>{nftData.name}</a></span>
                    <span>Price: {
                    tokenContractAddress === '0x0000000000000000000000000000000000000000' 
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
