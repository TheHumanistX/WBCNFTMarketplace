import React, { useContext } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const ListedSales = ({ 
    buyWithETH,
    buyWithWBC,
    price,
    listingID,
    tokenSymbol,
    paymentContractAddress,
     }) => {

    const { nftContract } = useContext(MarketplaceContext);

  return (
    <div>
      <button className='buynft__button' onClick={() =>
                paymentContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  buyWithETH(price, listingID)
                  :
                  buyWithWBC(price, listingID)}
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
