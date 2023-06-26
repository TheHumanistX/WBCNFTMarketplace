import React, { useState, useEffect } from 'react'
import { useContractRead } from '@thirdweb-dev/react';

const ShowOwnedNFTs = ({ ownedNFTs }) => {
    const [nftData, setNftData] = useState([]);

    const { data: nft } = useContractRead(crazyFacesContract, "tokenURI", [lastID > 0 ? lastID - 1 : 0]);

    useEffect(() => {
        const ipfsUrl = (ipfsUrl) => {
            if (!ipfsUrl) return '';
            // Convert the ipfs URL to a HTTP URL
            return `https://ipfs.io/ipfs/${ipfsUrl.split('ipfs://')[1]}`;
        };
    
        const fetchNftData = async () => {
            if (!nft || !lastID || lastID < 1) return;
            const url = ipfsUrl(nft);
            const response = await fetch(url);
            const json = await response.json();
            setNftData(json);
        };
    
        fetchNftData();
    }, [nft, lastID]);
    
        if (!nftData) return <div>Loading...</div>;
  return (
    <div>
      
    </div>
  )
}

export default ShowOwnedNFTs
