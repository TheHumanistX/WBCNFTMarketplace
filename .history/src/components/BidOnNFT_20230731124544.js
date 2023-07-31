import React, { useContext, useState } from 'react'
import { useEthers } from '../context'
import { useLocation } from 'react-router-dom';

const BidInput = ({ bidAmount, setBidAmount, placeholder }) => (
  <input type='number' id='bidAmount' name='bidAmount' placeholder={placeholder} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
);

const BidWithETH = ({ minBidAmount, bidAmount, setBidAmount, onBid, auctionID, minimumAllowableBid }) => (
  <div>
    <label htmlFor='bidAmount'>Bid Amount: </label>
    <BidInput bidAmount={bidAmount} setBidAmount={setBidAmount} placeholder={`Minimum ${minBidAmount} ETH`} />
    <button className='bidOnNFT__button' onClick={() => onBid(bidAmount, auctionID, minimumAllowableBid)}>Bid with ETH</button>
  </div>
);

const BidWithWBC = ({ minBidAmount, tokenSymbol, bidAmount, setBidAmount, onBid, bidMinIncrement, auctionID }) => (
  <div>
    <label htmlFor='bidAmount'>Bid Amount: </label>
    <BidInput bidAmount={bidAmount} setBidAmount={setBidAmount} placeholder={`Minimum ${minBidAmount} ${tokenSymbol}`} />
    <button className='bidOnNFT__button' onClick={() => onBid(bidAmount, auctionID, minimumAllowableBid)}>Bid with {tokenSymbol}</button><br />
    <button className='bidOnNFTIncrement__button' onClick={() => bidMinIncrement(`${minBidAmount}`, auctionID)}>Bid Min Increment</button>
  </div>
);

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

  if (paymentContractAddress === ETHEREUM_NULL_ADDRESS) {
    return <BidWithETH minBidAmount={minBidAmount} bidAmount={bidAmount} setBidAmount={setBidAmount} handleBidWithETH={handleBidWithETH} auctionID={auctionID} minimumAllowableBid={minimumAllowableBid} />;
  } else {
    return <BidWithWBC minBidAmount={minBidAmount} tokenSymbol={tokenSymbol} bidAmount={bidAmount} setBidAmount={setBidAmount} handleBidWithWBC={handleBidWithWBC} auctionID={auctionID} minimumAllowableBid={minimumAllowableBid} bidWithWBC={bidWithWBC} />;
  }
}

export default BidOnNFT
