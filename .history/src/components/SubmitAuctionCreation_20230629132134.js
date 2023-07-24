import React from 'react'

const SubmitAuctionCreation = ({ handleListingSubmission, setListingCurrency, tokenId }) => {
    return (
        <>
            <form onSubmit={handleListingSubmission} className='owned-nft__sale-form'>
                <label htmlFor='currency'>Currency: </label>
                <select
                    id='currency'
                    name='currency'
                    onChange={e => setListingCurrency(e.target.value)}
                >
                    <option value='ETH'>ETH</option>
                    <option value='WBC'>WBC</option>
                </select>
                <label htmlFor='initialBidAmount'>Initial Bid Amount: </label>
                <input type='text' id='initialBidAmount' name='initialBidAmount' placeholder='Initial Bid Amount' />
                <label htmlFor='bidIncrement'>Bid Increment: </label>
                <input type='text' id='bidIncrement' name='bidIncrement' placeholder='Bid Increment' />
                <label htmlFor='auctionBeginTime'>Auction Begin Time: </label>
                <input type='time' id='auctionBeginTime' name='auctionBeginTime' placeholder='Auction Begin Time' />
                <label htmlFor='auctionEndTime'>Auction End Time: </label>
                <input type='time' id='auctionEndTime' name='auctionEndTime' placeholder='Auction End Time' />                
                <input type='hidden' id='tokenId' name='tokenId' value={tokenId} />
                <input type='submit' value='List For Sale' />
            </form>
        </>
    )
}

export default SubmitAuctionCreation
