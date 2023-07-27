import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useContractRead } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';

const ShowOwnedNFTs = ({ tokenId, handleListNFTForSale, setSaleCurrency }) => {
    console.log('ShowOwnedNFTs rendered with props:', { nftContractAddress, nftContract, tokenId, handleListNFTForSale, setSaleCurrency });
    const {
        nftContractAddress,
        nftContract,
    } = useContext(MarketplaceContext);
    const [nftData, setNftData] = useState(null);
    const location = useLocation();
    const path = location.pathname;
    console.log('path: ', path)
    const { data: nft } = useContractRead(nftContract, "tokenURI", [tokenId >= 0 ? tokenId : 0]);

    useEffect(() => {
        const ipfsUrl = (ipfsUrl) => {
            if (!ipfsUrl) return '';
            // Convert the ipfs URL to a HTTP URL
            return `https://ipfs.io/ipfs/${ipfsUrl.split('ipfs://')[1]}`;
        };

        const fetchNftData = async () => {
            if (!nft || tokenId === null || tokenId === undefined) return;
            const url = ipfsUrl(nft);
            const response = await fetch(url);
            const json = await response.json();
            setNftData(json);
        };

        fetchNftData();
    }, [nft, tokenId]);


    if (!nftData) return <div>Loading...</div>;
    return (
        <div>
            {nftContract &&
                <div className='owned-nft__flex'>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContractAddress}/` + (tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' /></a>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContractAddress}/` + (tokenId)}>#{tokenId + 1} {nftData.name}</a></span>
                    {path === '/sellNFT' && (
                        // display form for selling NFT
                        <form onSubmit={handleListNFTForSale} className='owned-nft__sale-form'>
                            <label htmlFor='currency'>Currency: </label>
                            <select
                                id='currency'
                                name='currency'
                                onChange={e => setSaleCurrency(e.target.value)}
                            >
                                <option value='ETH'>ETH</option>
                                <option value='WBC'>WBC</option>
                            </select>
                            <label htmlFor='price'>Price: </label>
                            <input type='text' id='price' name='price' placeholder='Price' />
                            <input type='hidden' id='tokenId' name='tokenId' value={tokenId} />
                            <input type='submit' value='List For Sale' />
                        </form>
                    )}
                    {path === '/createAuction' && (
                        // display form for creating auction
                        <form onSubmit={handleListNFTForSale} className='owned-nft__sale-form'>
                            <label htmlFor='currency'>Currency: </label>
                            <select
                                id='currency'
                                name='currency'
                                onChange={e => setSaleCurrency(e.target.value)}
                            >
                                <option value='ETH'>ETH</option>
                                <option value='WBC'>WBC</option>
                            </select>
                            <label htmlFor='price'>Initial Bid Amount: </label>
                            <input type='text' id='price' name='price' placeholder='Price' />
                            <input type='hidden' id='tokenId' name='tokenId' value={tokenId} />
                            <input type='submit' value='List For Sale' />
                        </form>
                    )}

                </div>
            }

        </div>
    )
}

export default ShowOwnedNFTs
