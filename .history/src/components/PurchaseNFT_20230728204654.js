import React from 'react'
import { useEthers, useToken } from '../context'

const PurchaseNFT = ({ 
    buyWithETH,
    buyWithWBC,
    price,
    listingID,
    paymentContractAddress,
     }) => {
    
    const { ETHEREUM_NULL_ADDRESS } = useEthers();
    const { tokenSymbol } = useToken();

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
