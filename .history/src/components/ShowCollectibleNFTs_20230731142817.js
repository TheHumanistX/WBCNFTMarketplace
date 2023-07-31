import React, { useEffect } from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing, status }) => {

    const { marketplaceContract, cancelOrCollectSuccesful, setCancelOrCollectSuccesful } = useMarketplace();
    const { setNFTContractAddress, nftContract } = useNFT();

    useEffect(() => {
        setNFTContractAddress(listing.nftContractAddress);
    }, [listing])

    const handleCollect = async (auctionId) => {
        console.log('handleCollect entered....')
        try {
            const collectResponse = await marketplaceContract.endAuction(auctionId);
            const collectReceipt = await collectResponse.wait();
            console.info("Contract call successs", collectReceipt);
            console.log("Collect status", collectReceipt.status);
            setCancelOrCollectSuccesful(!cancelOrCollectSuccesful)
            return collectReceipt;
        } catch (err) {
            console.error("contract call failure", err.message);
        }
    }

    const handleCancelSale = async () => {
        console.log('handleCancelSale entered....')
        try {
            const cancelResponse = await marketplaceContract.cancelListing(listing.listingId);
            const cancelReceipt = await cancelResponse.wait();
            console.info("Contract call successs", cancelReceipt);
            console.log("Cancel status", cancelReceipt.status);
            setCancelOrCollectSuccesful(!cancelOrCollectSuccesful)
            return cancelReceipt;
        } catch (err) {
            console.error("contract call failure", err.message);
        }
    }
    const nftData = useFetchNftData(nftContract, listing.tokenId);

    if (!nftData || !nftContract) return null;

    const actionMap = {
        1: {
            action: () => handleCollect(listing.listingId),
            altText: 'Image of NFT Won By User',
            buttonText: 'Collect'
        },
        2: {
            action: () => handleCollect(listing.listingId),
            altText: 'Image of NFT From Expired Auction',
            buttonText: 'Collect'
        },
        3: {
            action: () => handleCancelSale(listing.listingId),
            altText: 'Image of NFT Listed For Sale',
            buttonText: 'Cancel'
        }
    };

    const { action, altText, buttonText } = actionMap[status];

    return (
        <>
            <div className='collectible-nft__container'>
                <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={altText} />
                <div className='collectible-nft__collect-button' onClick={action}>
                    {buttonText}
                </div>
            </div>
        </>
    )
}

export default ShowCollectibleNFTs
