import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useContractRead } from '@thirdweb-dev/react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { SubmitAuctionCreation, SubmitSaleListing} from './'

const ShowOwnedNFTs = ({ tokenId, handleListingSubmission, setListingCurrency }) => {
    
    const {
        nftContractAddress,
        nftContract,
    } = useContext(MarketplaceContext);
    const [nftData, setNftData] = useState(null);
    const location = useLocation();
    const path = location.pathname;
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
            try {
                const response = await fetch(url);
                const json = await response.json();
                setNftData(json);
            } catch (error) {
                console.error('(ShowOwnedNFTs)Failed to fetch NFT data:', error);
            }
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
                    {path === '/sell_nft' && (
                        // display form for selling NFT
                        <SubmitSaleListing handleListingSubmission={handleListingSubmission} setListingCurrency={setListingCurrency} tokenId={tokenId} />
                    )}
                    {path === '/create_auction' && (
                        // display form for creating auction
                        <SubmitAuctionCreation handleListingSubmission={handleListingSubmission} setListingCurrency={setListingCurrency} tokenId={tokenId} />
                    )}
                </div>
            }
        </div>
    )
}

export default ShowOwnedNFTs
