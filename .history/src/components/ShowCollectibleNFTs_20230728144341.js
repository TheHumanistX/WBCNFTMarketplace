import React from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing, status }) => {
    console.log('ShowCollectibleNFTs entered....')

    const { marketplaceContract } = useMarketplace();
    const { nftContract } = useNFT();

    console.log('ShowCollectibleNFTs listing: ', listing, ' and status: ', status)

    const nftData = useFetchNftData(nftContract, listing.tokenId);  

  return (
    <div className='collectible-nft__container'>
      
    </div>
  )
}

export default ShowCollectibleNFTs
