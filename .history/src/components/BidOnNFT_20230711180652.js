import React, { useContext, useState } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'
import { useLocation } from 'react-router-dom';

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, formattedCurrentBid, formattedMinBidIncrement, tokenSymbol, paymentContractAddress }) => {
  const {
    ETHEREUM_NULL_ADDRESS
  } = useContext(MarketplaceContext);
  const [bidAmount, setBidAmount] = useState('0');
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
  const minBidAmount = (parseFloat(formattedCurrentBid) * 100 + parseFloat(formattedMinBidIncrement) * 100) / 100;

  console.log('minBidAmount: ', minBidAmount)
  return (
    <div>
      {path === '/buy_nft' &&
        <div>
          <label htmlFor='bidAmount'>Bid Amount: </label>
          <input type='number' id='bidAmount' name='bidAmount' placeholder={`Must Be At Least ${minBidAmount} ${tokenSymbol}`} onChange={(e) => setBidAmount(e.target.value)} />
          <button className='bidOnNFT__button' onClick={() =>
            paymentContractAddress === ETHEREUM_NULL_ADDRESS
              ?
              bidWithETH(bidAmount, auctionID)
              :
              bidWithWBC(bidAmount, auctionID)
          }
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
      }
    </div>
  )
}

export default BidOnNFT
