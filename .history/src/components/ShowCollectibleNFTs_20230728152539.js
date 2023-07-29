import React, { useEffect } from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing, status }) => {
    console.log('ShowCollectibleNFTs entered....')

    const { marketplaceContract } = useMarketplace();
    const { setNFTContractAddress, nftContract } = useNFT();

    useEffect(() => {
        setNFTContractAddress(listing.nftContractAddress);
    }, [listing])

    console.log('ShowCollectibleNFTs listing: ', listing.tokenId, ' and status: ', status)
    console.log('ShowCollectibleNFTs nftContract: ', nftContract)

    const handleCollect = async () => {
        console.log('handleCollect entered....')
        try {
            const collectResponse = await marketplaceContract.endAuction(listing.listingId);
            const collectReceipt = await collectResponse.wait();
            console.info("Contract call successs", collectReceipt);
            console.log("Collect status", collectReceipt.status);
            return collectReceipt;
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    handleCancelSale = async () => {
        console.log('handleCancelSale entered....')
        try {
            const cancelResponse = await marketplaceContract.cancelListing(listing.listingId);
            const cancelReceipt = await cancelResponse.wait();
            console.info("Contract call successs", cancelReceipt);
            console.log("Cancel status", cancelReceipt.status);
            return cancelReceipt;
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    const nftData = useFetchNftData(nftContract, listing.tokenId);

    console.log('ShowCollectibleNFTs nftData: ', nftData)

    if (!nftData || !nftContract) return null;

    return (
        <>
            {status === 1 &&
                <div className='collectible-nft__container'>
                    <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' />
                    <div className='collectible-nft__collect-button'>
                        Collect
                    </div>

                </div>
            }
            {status === 2 &&
                <div className='collectible-nft__container'>

                </div>
            }
            {status === 3 &&
                <div className='collectible-nft__container'>

                </div>
            }
        </>
    )
}

export default ShowCollectibleNFTs
