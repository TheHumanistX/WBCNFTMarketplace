import React, { useState, useEffect } from 'react'
import { useContractRead } from '@thirdweb-dev/react';

const ShowOwnedNFTs = ({ contract, nftId }) => {
    const [nftData, setNftData] = useState([]);

    const { data: nft } = useContractRead(contract, "tokenURI", [nftId > 0 ? nftId - 1 : 0]);

    useEffect(() => {
        const ipfsUrl = (ipfsUrl) => {
            if (!ipfsUrl) return '';
            // Convert the ipfs URL to a HTTP URL
            return `https://ipfs.io/ipfs/${ipfsUrl.split('ipfs://')[1]}`;
        };
    
        const fetchNftData = async () => {
            if (!nft || !nftId || nftId < 1) return;
            const url = ipfsUrl(nft);
            const response = await fetch(url);
            const json = await response.json();
            setNftData(nftData => [...nftData, json]);
        };
    
        fetchNftData();
    }, [nft, nftId]);
    
        if (!nftData) return <div>Loading...</div>;
  return (
    <div>
      
    </div>
  )
}

export default ShowOwnedNFTs
