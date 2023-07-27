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

    useEffect(() => {
        // Create a function that will fetch the NFT data from IPFS, using ethers js, for the given tokenId
        // and set the state variable nftData to the result
        const fetchURI = async () => {
            // If I had simply put `!tokenId`, tokenId of 0 would register as falsy/!tokenId, which was a problem. 
            if (!nftContract || tokenId === null || tokenId === undefined) return;
            const nft = await nftContract.tokenURI(tokenId >= 0 ? tokenId : 0);
            console.log('nft: ', nft);
            setNFT(nft);
        }
        fetchURI();
    }, [nftContract, tokenId])

    const nftData = useFetchNftData(nft, tokenId);

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
