import React, { useContext } from 'react'
import { useContractRead } from '@thirdweb-dev/react'
import { MarketplaceContext } from '../context/MarketplaceContext'


const CheckNFTStatus = ({ listingID, onCheckCompleted }) => {
    const { marketplaceContract } = useContext(MarketplaceContext);
    console.log('Calling "getListingStatus" with listingID: ', listingID)
    const { data: nftListingStatus } = useContractRead(marketplaceContract, "getListingStatus", [listingID]);
    console.log('nftListingStatus: ', nftListingStatus);

  return (
    <>
    {nftListingStatus === 1 ? onCheckCompleted(true) : onCheckCompleted(false)}
    </>
  )
}

export default CheckNFTStatus
