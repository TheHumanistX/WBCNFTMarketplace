import react, { useState, useEffect } from 'react';

export const useOwnedNFTs = (lastNFTMintedId, nftContract, marketplaceContract, userWalletAddress) => {
    const [ownedNFTs, setOwnedNFTs] = useState([]);

    useEffect(() => {
        if( !nftContract || !marketplaceContract || !userWalletAddress ) return;
        let isMounted = true;

        const fetchNFTs = async () => {
            console.log('Fetching NFTs for wallet address: ', userWalletAddress)
            const tokenIds = Array.from({length: lastNFTMintedId}, (_, i) => i);  // Create an array [0, 1, 2, ..., lastNFTMintedId - 1]
            
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
    }, [nftContract, marketplaceContract, userWalletAddress]);

    return ownedNFTs;
};
