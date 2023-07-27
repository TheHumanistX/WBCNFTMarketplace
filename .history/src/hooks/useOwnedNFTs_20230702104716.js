import react, { useState, useEffect } from 'react';

export const useOwnedNFTs = (lastNFTMintedId, nftContract, marketplaceContract, userWalletAddress) => {
    const [ownedNFTs, setOwnedNFTs] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchNFTs = async () => {
            const tokenIdsOwnedByWallet = [];
            for (let i = 1; i <= lastNFTMintedId; i++) {
                try {
                    const owner = await nftContract.ownerOf(i);
                    if (owner.toLowerCase() === userWalletAddress.toLowerCase()) {
                        const listing = await marketplaceContract.getListing(i);
                        if (listing.status !== "ACTIVE") {
                            tokenIdsOwnedByWallet.push(i);
                        }
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
