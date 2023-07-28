import React, { useState } from 'react'
import { useContractRead } from '@thirdweb-dev/react';

const ShowListedNFTs = ({ liveListings }) => {
    const [nftData, setNftData] = useState(null);

    const { data: nft } = useContractRead(contract, "tokenURI", [nftId >= 0 ? nftId : 0]);

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
        {liveListings && liveListings.map((listing, index) => {
            return (
                <div key={index}>
                <span>Listing ID: {listing}</span>
                <img src=
                </div>
            )
        }
    </div>
  )
}

export default ShowListedNFTs