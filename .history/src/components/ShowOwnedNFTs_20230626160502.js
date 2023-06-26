import React, { useState, useEffect } from 'react'
import { useContractRead } from '@thirdweb-dev/react';

const ShowOwnedNFTs = ({ contractAddress, contract, nftId, handleListNFTForSale }) => {
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
            <div className='owned-nft__flex'>
            <a href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/` + (nftId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' /></a>
            <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/` + (nftId)}>#{nftId + 1} {nftData.name}</a></span>
            <form onSubmit={handleListNFTForSale} className='owned-nft__sale-form'>
                <label for='currency'>Currency: </label>
                    <select id='currency' name='currency'>
                        <option value='ETH' onclick={setSaleCurrency(ETH)}>ETH</option>
                        <option value='WBC' onclick={setSaleCurrency(WBC)}>WBC</option>
                    </select>
                <label for='price'>Price: </label>
                    <input type='text' id='price' name='price' placeholder='Price' />
                <input type='submit' value='List For Sale' />
            </form>
            </div>
            }
            
        </div>
    )
}

export default ShowOwnedNFTs
