import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useContractRead } from '@thirdweb-dev/react';
import { useNFT } from '../context';
import { SubmitAuctionCreation, SubmitSaleListing} from './'
import { useFetchNftData } from '../hooks/';

const ShowOwnedNFTs = ({ tokenId, onListingSubmission, setListingCurrency }) => {
    console.log("Entered ShowOwnedNFTs with tokenId of ", tokenId)
    const {
        nftContractAddress,
        nftContract,
    } = useNFT();
    
    const location = useLocation();
    const path = location.pathname;
    const [nft, setNFT] = useState(null);
    // const { data: nft } = useContractRead(nftContract, "tokenURI", [tokenId >= 0 ? tokenId : 0]);

    const nftData = useFetchNftData(nftContract, tokenId);

    if (!nftData) return <div>Loading...</div>;
    return (
        <div>
            {nftContract &&
                <div className='owned-nft__flex'>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContractAddress}/` + (tokenId)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' /></a>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContractAddress}/` + (tokenId)}>#{tokenId + 1} {nftData.name}</a></span>
                    {path === '/sell_nft' && (
                        // display form for selling NFT
                        <SubmitSaleListing onListingSubmission={onListingSubmission} setListingCurrency={setListingCurrency} tokenId={tokenId} />
                    )}
                    {path === '/create_auction' && (
                        // display form for creating auction
                        <SubmitAuctionCreation onListingSubmission={onListingSubmission} setListingCurrency={setListingCurrency} tokenId={tokenId} />
                    )}
                </div>
            }
        </div>
    )
}

export default ShowOwnedNFTs
