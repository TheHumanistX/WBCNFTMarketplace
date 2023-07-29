import React, { useContext, useState } from 'react'
import { useEthers } from '../context'
import { useLocation } from 'react-router-dom';

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, formattedCurrentBid, formattedMinBidIncrement, tokenSymbol, paymentContractAddress }) => {
  const { ETHEREUM_NULL_ADDRESS } = useEthers();
  const location = useLocation();
  const path = location.pathname;
  
  const [bidAmount, setBidAmount] = useState('');
  const minBidAmount = (parseFloat(formattedCurrentBid) * 100 + parseFloat(formattedMinBidIncrement) * 100) / 100;
  const minimumAllowableBid = parseFloat(formattedCurrentBid) + parseFloat(formattedMinBidIncrement);

  const handleBidWithETH = (bidAmount, auctionID, minimumAllowableBid) => {
    
    bidWithETH(bidAmount, auctionID, minimumAllowableBid)

    setBidAmount('')
  
  }
  const handleBidWithWBC = (bidAmount, auctionID, minimumAllowableBid) => {
    
    bidWithWBC(bidAmount, auctionID, minimumAllowableBid)

    setBidAmount('')
  
  }

  return (
    <div>
      {paymentContractAddress === ETHEREUM_NULL_ADDRESS ?
        <div>
          <label htmlFor='bidAmount'>Bid Amount: </label>
          <input type='number' id='bidAmount' name='bidAmount' placeholder={`Minimum ${minBidAmount} ETH`} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
          <button className='bidOnNFT__button' onClick={() =>
              handleBidWithETH(bidAmount, auctionID, minimumAllowableBid)
          }
          >
            Bid with ETH
          </button>
        </div>
        :
        <div>
          <label htmlFor='bidAmount'>Bid Amount: </label>
          <input type='number' id='bidAmount' name='bidAmount' placeholder={`Minimum ${minBidAmount} ${tokenSymbol}`} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
          <button className='bidOnNFT__button' onClick={() =>
              handleBidWithWBC(bidAmount, auctionID, minimumAllowableBid)
          }
          >
            Bid with {tokenSymbol}
          </button><br />
          <button className='bidOnNFTIncrement__button' onClick={() => 
            
            bidWithWBC(`${minBidAmount}`, auctionID)
          }>
            Bid Min Increment
          </button>
        </div>
      }
    </div>
  )
}

export default BidOnNFT
