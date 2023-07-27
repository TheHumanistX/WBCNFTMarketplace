import React, { useContext } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, formattedMinBidIncrement, tokenSymbol, paymentContractAddress }) => {
    const {
      ETHEREUM_NULL_ADDRESS
    } = useContext(MarketplaceContext);
    
    console.log('BidOnNFT minBidIncrement: ', minBidIncrement);
    console.log('BidOnNFT tokenSymbol: ', tokenSymbol);

    //! Temp to kill error:
    let bidAmount;
    //////////
  return (
    <div>
      <label htmlFor='bidAmount'>Bid Amount: </label>
      <input type='text' id='bidAmount' name='bidAmount' placeholder={`Must Be At Least ${formattedMinBidIncrement} ${tokenSymbol}`} onChange={(e) => bidAmount = e.target.value} />
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
