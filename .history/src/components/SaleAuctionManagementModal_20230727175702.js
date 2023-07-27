import React, { useState } from 'react'

const SaleAuctionManagementModal = (open, onClose) => {
  if (!open) return null;
  const [auctionsToCollect, setAuctionsToCollect] = useState(false)
  const [salesToCancel, setSalesToCancel] = useState(false)

  return (
    <div className='management-modal__container'>
      <h1>Manage Your Sales and Auctions</h1>
      <div className='management-modal__flex'>
        <div className='management-modal__flex-item'>
          <h2>Collect Auctions</h2>
          <p>Collect your auctions that have ended.</p>
          <button className='management-modal__button' onClick={() => setAuctionsToCollect(true)}>Collect Auctions</button>
        </div>
        <div className='management-modal__flex-item'>
          <h2>Cancel Sales</h2>
          <p>Cancel your sales that have not ended.</p>
          <button className='management-modal__button' onClick={() => setSalesToCancel(true)}>Cancel Sales</button>
        </div>
        <div className='management-modal__flex-item button'>
          <button className='management-modal__button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default SaleAuctionManagementModal
