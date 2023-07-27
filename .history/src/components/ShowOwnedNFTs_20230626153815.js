import React, { useState, useEffect } from 'react'
import { useContractRead } from '@thirdweb-dev/react';

const ShowOwnedNFTs = ({ contract, nftId }) => {
    console.log('Entered ShowOwnedNFTs')
    const [nftData, setNftData] = useState(null);

    const { data: nft } = useContractRead(contract, "tokenURI", [nftId >= 0 ? nftId : 0]);
    console.log('nftId: ', nftId);
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

    if (!nftData) return <div>Loading...</div>;
    return (
        <div>
            {contract && 
            <>
            <a href={`https://testnets.opensea.io/assets/goerli/${contract}/` + (nftId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' /></a>
            <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${contract}/` + (nftId)}>#{nftId + 1} {nftData.name}</a></span>
            </>
            }
            
        </div>
    )
}

export default ShowOwnedNFTs
