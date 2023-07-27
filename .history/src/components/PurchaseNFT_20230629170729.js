import React, { useContext } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const PurchaseNFT = ({ 
    buyWithETH,
    buyWithWBC,
    price,
    listingID,
    tokenSymbol,
    paymentContractAddress,
     }) => {

    const { nftContract, ETHEREUM_NULL_ADDRESS } = useContext(MarketplaceContext);

  return (
    <div>
      <button className='buynft__button' onClick={() =>
                paymentContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  buyWithETH(price, listingID)
                  :
                  buyWithWBC(price, listingID)}
              >
                Buy with
                {paymentContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  ' ETH'
                  :
                  ' ' + tokenSymbol
                }
              </button>

    </div>
  )
}

export default PurchaseNFT
