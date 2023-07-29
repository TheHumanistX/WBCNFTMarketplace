import React from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing, status }) => {
    console.log('ShowCollectibleNFTs entered....')

    const { marketplaceContract } = useMarketplace();
     const { setNFTContractAddress, nftContract } = useNFT();

    console.log('ShowCollectibleNFTs listing: ', listing.tokenId, ' and status: ', status)
    console.log('ShowCollectibleNFTs nftContract: ', nftContract)
    const nftData = useFetchNftData(nftContract, listing.tokenId);  
    console.log('ShowCollectibleNFTs nftData: ', nftData)

  return (
    <>
    {status === 1 &&
    <div className='collectible-nft__container'>
      {/* <img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='owned-nfts' /> */}
      
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
