import React from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing }) => {

    const { marketplaceContract } = useMarketplace();
    const { nftContract } = useNFT();

    console.log('ShowCollectibleNFTs listing: ', listing)

    const nftData = useFetchNftData(nftContract, listing.tokenId);  

  return (
    <div className='collectible-nft__container'>
      
    </div>
  )
}

export default ShowCollectibleNFTs
