import React from 'react'

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, tokenSymbol, paymentContractAddress }) => {
  return (
    <div>
      <button className='bidOnNFT__button' onClick={() =>
                paymentContractAddress === ETHEREUM_NULL_ADDRESS
                  ?
                  bidWithETH(price, listingID)
                  :
                  bidWithWBC(price, listingID)}
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
