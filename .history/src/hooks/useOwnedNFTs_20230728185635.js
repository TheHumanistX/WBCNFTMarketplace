import react, { useState, useEffect } from 'react';
import { useEthers, useMarketplace, useNFT } from '../context';

export const useOwnedNFTs = (txConfirm) => {

    const { userWalletAddress } = useEthers();
    const { cancelOrCollectSuccesful, marketplaceContract } = useMarketplace();
    const { 
        lastNFTMintedId,
        nftContract,
     } = useNFT();

    const [ownedNFTs, setOwnedNFTs] = useState([]);

    useEffect(() => {
        if( !nftContract || !marketplaceContract || !userWalletAddress ) return;
        let isMounted = true;
        
        const fetchNFTs = async () => {
            
            const tokenIds = Array.from({length: lastNFTMintedId + 1}, (_, i) => i);  // Create an array [0, 1, 2, ..., lastNFTMintedId - 1]
            
            const tokenIdsOwnedByWallet = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    try {
                        const owner = await nftContract.ownerOf(tokenId);
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
    }, [nftContract, marketplaceContract, userWalletAddress, lastNFTMintedId, txConfirm, cancelOrCollectSuccesful]);

    return ownedNFTs;
};
