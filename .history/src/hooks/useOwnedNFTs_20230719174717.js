import react, { useState, useEffect } from 'react';
import { useEthers, useMarketplace, useNFT } from '../context';

export const useOwnedNFTs = ( txConfirm) => {

    const { userWalletAddress } = useEthers();
    const { marketplaceContract } = useMarketplace();
    const { 
        lastNFTMintedId,
        nftContract,
     } = useNFT();

    const [ownedNFTs, setOwnedNFTs] = useState([]);

    useEffect(() => {
        if( !nftContract || !marketplaceContract || !userWalletAddress ) return;
        let isMounted = true;
        console.log('useOwnedNFTs userWalletAddress', userWalletAddress)
        const fetchNFTs = async () => {
            console.log('Fetching NFTs for wallet address: ', userWalletAddress)
            console.log('Fetching NFTs with lastNFTMintedId: ', lastNFTMintedId)
            const tokenIds = Array.from({length: lastNFTMintedId + 1}, (_, i) => i);  // Create an array [0, 1, 2, ..., lastNFTMintedId - 1]
            
            const tokenIdsOwnedByWallet = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    console.log('useOwnedNFTs -- Processing NFT ID ', tokenId)
                    try {
                        const owner = await nftContract.call("ownerOf", [tokenId]);
                        console.log('useOwnedNFTs -- Owner of NFT ID ', tokenId, ' is ', owner)
                        return owner.toLowerCase() === userWalletAddress.toLowerCase() ? tokenId : null;
                    } catch (error) {
                        console.log('useOwnedNFTs -- Error fetching NFTs:', error);
                        return null;
                    }
                })
            );
        
            if (isMounted) {
                setOwnedNFTs(tokenIdsOwnedByWallet.filter(id => id !== null));  // Filter out nulls
            }
        };        

        fetchNFTs();

        return () => {
            isMounted = false;
        }
    }, [nftContract, marketplaceContract, userWalletAddress, lastNFTMintedId, txConfirm]);

    return ownedNFTs;
};
