import React, { useContext, useState } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'
import { useLocation } from 'react-router-dom';
import { useBidWithWBC } from '../hooks';

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, formattedCurrentBid, formattedMinBidIncrement, tokenSymbol, paymentContractAddress }) => {
  const minBidAmount = (parseFloat(formattedCurrentBid) * 100 + parseFloat(formattedMinBidIncrement) * 100) / 100;
  const {
    ETHEREUM_NULL_ADDRESS
  } = useContext(MarketplaceContext);
  const [bidAmount, setBidAmount] = useState('');
  const location = useLocation();
  const path = location.pathname;

  console.log('BidOnNFT minBidIncrement: ', minBidIncrement);
  console.log('BidOnNFT auctionID: ', auctionID);
  console.log('BidOnNFT tokenSymbol: ', tokenSymbol);
  console.log('BidOnNFT paymentContractAddress: ', paymentContractAddress)
  console.log('BidOnNFT does paymentContractAddres = ethereum null? ', paymentContractAddress === ETHEREUM_NULL_ADDRESS);
  console.log('BidOnNFT bidAmount: ', bidAmount);
  console.log('BidOnNFT parseFloat(formattedCurrentBid): ', parseFloat(formattedCurrentBid))
  console.log('BidOnNFT parseFloat(formattedMinBidIncrement): ', parseFloat(formattedMinBidIncrement))

  console.log('minBidAmount: ', minBidAmount)

  const handleBidWithETH = (bidAmount, auctionID) => {
    
    bidWithETH(bidAmount, auctionID)

    setBidAmount('')
  
  }
  const handleBidWithWBC = (bidAmount, auctionID) => {
    
    useBidWithWBC(bidAmount, auctionID)

    setBidAmount('')
  
  }

  return (
    <div>
      {paymentContractAddress === ETHEREUM_NULL_ADDRESS ?
        <div>
          <label htmlFor='bidAmount'>Bid Amount: </label>
          <input type='number' id='bidAmount' name='bidAmount' placeholder={`Minimum ${minBidAmount} ${tokenSymbol}`} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
          <button className='bidOnNFT__button' onClick={() =>
              handleBidWithETH(bidAmount, auctionID)
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
              handleBidWithWBC(bidAmount, auctionID)
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