import React, { useEffect } from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing, status }) => {

    const { marketplaceContract, cancelOrCollectSuccesful, setCancelOrCollectSuccesful } = useMarketplace();
    const { setNFTContractAddress, nftContract } = useNFT();

    useEffect(() => {
        setNFTContractAddress(listing.nftContractAddress);
    }, [listing])

    const handleAction = (action, successLog, errorLog) => async (id) => {
        console.log(`Entering ${action.name}...`)
        try {
            const response = await marketplaceContract[action](id);
            const receipt = await response.wait();
            console.info(successLog, receipt);
            console.log(`${action.name} status`, receipt.status);
            setCancelOrCollectSuccesful(!cancelOrCollectSuccesful)
            return receipt;
        } catch (err) {
            console.error(errorLog, err.message);
        }
    }
    
    const handleCollect = handleAction(marketplaceContract.endAuction, "Contract call success", "Contract call failure");
    const handleCancelSale = handleAction(marketplaceContract.cancelListing, "Contract call success", "Contract call failure");
    
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
