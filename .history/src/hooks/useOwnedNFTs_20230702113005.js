import react, { useState, useEffect } from 'react';

export const useOwnedNFTs = (lastNFTMintedId, nftContract, marketplaceContract, userWalletAddress) => {
    const [ownedNFTs, setOwnedNFTs] = useState([]);

    useEffect(() => {
        if( !nftContract || !marketplaceContract || !userWalletAddress ) return;
        let isMounted = true;

        const fetchNFTs = async () => {
            console.log('Fetching NFTs for wallet address: ', userWalletAddress)
            const tokenIdsOwnedByWallet = [];
            for (let i = 0; i <= lastNFTMintedId - 1; i++) {
                console.log('For loop entered....')
                try {
                    const owner = await nftContract.call("ownerOf", [i]);
                    console.log('Owner of NFT ID ', i, ' is ', owner)
                    if (owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                            console.log('User owns nft ID ', i)
                            tokenIdsOwnedByWallet.push(i);
                    }
                } catch (error) {
                    console.log('Error fetching NFTs:', error);
                }
            }

            if (isMounted) {
                setOwnedNFTs(tokenIdsOwnedByWallet);
            }
        };

        fetchNFTs();

        return () => {
            isMounted = false;
        }
    }, [nftContract, marketplaceContract, userWalletAddress]);

    return ownedNFTs;
};
