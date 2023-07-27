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
    {
    nftListingStatus === 1 
    ?
    (onCheckCompleted(true), console.log('Returning True to BuyNFT.js'))
    : 
    (onCheckCompleted(false), console.log('Returning False to BuyNFT.js'))
    }
    </>
  )
}

export default CheckNFTStatus
