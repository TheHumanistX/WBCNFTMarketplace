import React, { useContext } from 'react'
import { useContractRead } from '@thirdweb-dev/react'
import { MarketplaceContext } from '../context/MarketplaceContext'


const CheckNFTStatus = ({ listingID, onCheckCompleted }) => {
    const { marketplaceContract } = useContext(MarketplaceContext);
    console.log('Calling "getListingStatus" with listingID: ', listingID)
    const { data: nftListingStatus } = useContractRead(marketplaceContract, "getListingStatus", [listingID]);
    console.log('nftListingStatus: ', nftListingStatus);

    useEffect(() => {
        if (nftListingStatus === 1) {
          console.log('Returning True to BuyNFT.js');
          onCheckCompleted(true);
        } else {
          console.log('Returning False to BuyNFT.js');
          onCheckCompleted(false);
        }
      }, [nftListingStatus, onCheckCompleted]);
    
      return null;
}

export default CheckNFTStatus
