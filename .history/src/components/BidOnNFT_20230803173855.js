import React, { useState } from 'react'
import { useEthers } from '../context'

const BidInput = ({ bidAmount, setBidAmount, placeholder }) => (
  <div className='BidOnNFT__BidInput'>
    <label htmlFor='bidAmount'>Bid Amount: </label>
    <input type='number' id='bidAmount' name='bidAmount' placeholder={placeholder} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
  </div>
);

const BidWithETH = ({
  minBidAmount,
  bidAmount,
  setBidAmount,
  handleBidWithETH,
  auctionID,
  minimumAllowableBid
}) => (
  <div className='BidOnNFT-container'>
    <BidInput bidAmount={bidAmount} setBidAmount={setBidAmount} placeholder={`Minimum ${minBidAmount} ETH`} />
    <button className='bidOnNFT__button' onClick={() =>
      handleBidWithETH(bidAmount, auctionID, minimumAllowableBid)
    }
    >
      Bid with ETH
    </button>
  </div>
)

const BidWithWBC = ({
  minBidAmount,
  tokenSymbol,
  bidAmount,
  setBidAmount,
  handleBidWithWBC,
  auctionID,
  minimumAllowableBid,
  bidWithWBC
}) => (
  <div className='BidOnNFT-container'>
    <BidInput bidAmount={bidAmount} setBidAmount={setBidAmount} placeholder={`Minimum ${minBidAmount} ${tokenSymbol}`} />
    <div className='bidOnNFT__button-container'>
      <button className='bidOnNFTIncrement__button' onClick={() =>
        bidWithWBC(`${minBidAmount}`, auctionID)
      }>
        Bid Min Increment
      </button>
      <button className='bidOnNFT__button' onClick={() =>
        handleBidWithWBC(bidAmount, auctionID, minimumAllowableBid)
      }
      >
        Bid Entered Amount
      </button>
    </div>
  </div>
)

const BidOnNFT = ({ bidWithETH, bidWithWBC, auctionID, minBidIncrement, formattedCurrentBid, formattedMinBidIncrement, tokenSymbol, paymentContractAddress }) => {
  const { ETHEREUM_NULL_ADDRESS } = useEthers();

  const [bidAmount, setBidAmount] = useState('');
  const minBidAmount = (parseFloat(formattedCurrentBid) * 100 + parseFloat(formattedMinBidIncrement) * 100) / 100;
  const minimumAllowableBid = parseFloat(formattedCurrentBid) + parseFloat(formattedMinBidIncrement);

  const handleBidWithETH = (bidAmount, auctionID, minimumAllowableBid) => {
    bidWithETH(bidAmount, auctionID, minimumAllowableBid);
    setBidAmount('')
  }

  const handleBidWithWBC = (bidAmount, auctionID, minimumAllowableBid) => {
    bidWithWBC(bidAmount, auctionID, minimumAllowableBid)
    setBidAmount('')
  }

  if (paymentContractAddress === ETHEREUM_NULL_ADDRESS) {
    return <BidWithETH minBidAmount={minBidAmount} bidAmount={bidAmount} setBidAmount={setBidAmount} handleBidWithETH={handleBidWithETH} auctionID={auctionID} minimumAllowableBid={minimumAllowableBid} />;
  } else {
    return <BidWithWBC minBidAmount={minBidAmount} tokenSymbol={tokenSymbol} bidAmount={bidAmount} setBidAmount={setBidAmount} handleBidWithWBC={handleBidWithWBC} auctionID={auctionID} minimumAllowableBid={minimumAllowableBid} bidWithWBC={bidWithWBC} />;
  }
}

export default BidOnNFT
