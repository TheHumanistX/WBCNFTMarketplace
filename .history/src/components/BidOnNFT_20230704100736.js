import React, { useContext } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, tokenSymbol, paymentContractAddress }) => {
    const {
      ETHEREUM_NULL_ADDRESS
    } = useContext(MarketplaceContext);
  
  return (
    <div>
      <button className='bidOnNFT__button' onClick={() =>
                paymentContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  bidWithETH(bidAmount, auctionID)
                  :
                  bidWithWBC(bidAmount, auctionID)}
              >
                Bid with
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

export default BidOnNFT
