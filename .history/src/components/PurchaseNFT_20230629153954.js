import React, { useContext } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const ListedSales = ({ 
    listingID,
    owner,
    nftPrice,
    tokenID,
    nftData,
    tokenSymbol,
    paymentContractAddress,
    nftContractName }) => {

    const { nftContract } = useContext(MarketplaceContext);

  return (
    <div>
      <button className='buynft__button' onClick={() =>
                paymentContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  buyWithETH(listing.price, listing.listingID)
                  :
                  buyWithWBC(listing.price, listing.listingID)}
              >
                Buy with
                {paymentContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  ' ETH'
                  :
                  ' ' + tokenSymbol
                }
              </button>

    </div>
  )
}

export default ListedSales
