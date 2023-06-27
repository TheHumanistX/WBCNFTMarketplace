import React, { useState, useEffect } from 'react'
import { useContractRead } from '@thirdweb-dev/react';

const ShowListedNFTs = ({ listing, marketplaceContract }) => {
    const [nftData, setNftData] = useState(null);
    const {listingID, nftContract, owner, price, tokenContract, tokenID: nftId } = listing;
    const { data: nft } = useContractRead(marketplaceContract, "tokenURI", [nftId >= 0 ? nftId : 0]);

    useEffect(() => {
        const ipfsUrl = (ipfsUrl) => {
            if (!ipfsUrl) return '';
            // Convert the ipfs URL to a HTTP URL
            return `https://ipfs.io/ipfs/${ipfsUrl.split('ipfs://')[1]}`;
        };

        const fetchNftData = async () => {
            if (!nft || nftId === null || nftId === undefined) return;
            const url = ipfsUrl(nft);
            const response = await fetch(url);
            const json = await response.json();
            setNftData(json);
        };

        fetchNftData();
    }, [nft, nftId]);
  return (
    <div>
        <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (nftId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' /></a>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (nftId)}>#{nftId + 1} {nftData.name}</a></span>
    </div>
  )
}

export default ShowListedNFTs
