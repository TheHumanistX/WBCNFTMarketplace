import React, { useState } from 'react'

const SubmitAuctionCreation = ({ onListingSubmission, setListingCurrency, tokenId }) => {
    const [initialBidAmount, setInitialBidAmount] = useState('');
    const [bidIncrement, setBidIncrement] = useState('');
    const [auctionBeginTime, setAuctionBeginTime] = useState('');
    const [auctionEndTime, setAuctionEndTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Pass the form values to the parent component
        onListingSubmission({
            initialBidAmount,
            bidIncrement,
            auctionBeginTime,
            auctionEndTime,
            tokenId
        });

        // Reset form fields
        setInitialBidAmount('');
        setBidIncrement('');
        setAuctionBeginTime('');
        setAuctionEndTime('');
    }
    return (
        <>
            <form onSubmit={handleSubmit} className='owned-nft__sale-form'>
                <label htmlFor='currency'>Currency: </label>
                <select
                    id='currency'
                    name='currency'
                    onChange={e => setListingCurrency(e.target.value)}
                >
                    <option value='ETH'>ETH</option>
                    <option value='WBC'>WBC</option>
                </select>
                <label htmlFor='initialBidAmount'>Starting Bid Amount: </label>
                <input type='text' id='initialBidAmount' value={initialBidAmount} onChange={e => setInitialBidAmount(e.target.value)} placeholder='Starting Bid Amount' />
                <label htmlFor='bidIncrement'>Minimum Bid Increment: </label>
                <input type='text' id='bidIncrement' value={bidIncrement} onChange={e => setBidIncrement(e.target.value)} placeholder='Bid Increment' />
                <label htmlFor='auctionBeginTime'>Auction Begin Time: </label>
                <input type='datetime-local' id='auctionBeginTime' value={auctionBeginTime} onChange={e => setAuctionBeginTime(e.target.value)} placeholder='Auction Begin Time' />
                <label htmlFor='auctionEndTime'>Auction End Time: </label>
                <input type='datetime-local' id='auctionEndTime' value={auctionEndTime} onChange={e => setAuctionEndTime(e.target.value)} placeholder='Auction End Time' />                
                <input type='hidden' id='tokenId' name='tokenId' value={tokenId} />
                <input type='submit' value='Create Auction' />
            </form>
        </>
    )
}

export default SubmitAuctionCreation
