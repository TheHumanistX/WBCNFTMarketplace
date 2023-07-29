import React from 'react'
import { useMarketplace, useNFT } from '../context'
import { useFetchNftData } from '../hooks'

const ShowCollectibleNFTs = ({ listing }) => {

    const { marketplaceContract } = useMarketplace();
    const { nftContract } = useNFT();

    const nftData = useFetchNftData(nftContract, listing.tokenId); //! Need to figure out how to work this. tokenId needs to be pulled from activeSales.tokenId, etc.  Need this done in a mapping... 

  return (
    <div>
      
    </div>
  )
}

export default ShowCollectibleNFTs
