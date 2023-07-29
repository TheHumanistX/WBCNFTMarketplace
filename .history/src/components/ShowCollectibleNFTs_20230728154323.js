import React, { useEffect } from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing, status }) => {
    console.log('ShowCollectibleNFTs entered....')

    const { marketplaceContract, cancelOrCollectSuccesful, setCancelOrCollectSuccesful } = useMarketplace();
    const { setNFTContractAddress, nftContract } = useNFT();

    useEffect(() => {
        setNFTContractAddress(listing.nftContractAddress);
    }, [listing])

    console.log('ShowCollectibleNFTs listing: ', listing.tokenId, ' and status: ', status)
    console.log('ShowCollectibleNFTs nftContract: ', nftContract)

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

    console.log('ShowCollectibleNFTs nftData: ', nftData)

    if (!nftData || !nftContract) return null;

    return (
        <>
            {status === 1 &&
                <div className='collectible-nft__container'>
                    <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt='Image of NFT Won By User' />
                    <div className='collectible-nft__collect-button' onClick={() => handleCollect(listing.listingId)}>
                        Collect
                    </div>

                </div>
            }
            {status === 2 &&
                <div className='collectible-nft__container'>
                    <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt='Image of NFT From Expired Auction' />
                    <div className='collectible-nft__collect-button' onClick={() => handleCollect(listing.listingId)}>
                        Collect
                    </div>
                </div>
            }
            {status === 3 &&
                <div className='collectible-nft__container'>
                    <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt='Image of NFT Listed For Sale' />
                    <div className='collectible-nft__collect-button' onClick={() => handleCancelSale(listing.listingId)}>
                        Cancel
                    </div>
                </div>
            }
        </>
    )
}

export default ShowCollectibleNFTs
