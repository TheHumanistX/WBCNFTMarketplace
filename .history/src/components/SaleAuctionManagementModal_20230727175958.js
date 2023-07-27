import React, { useState } from 'react'

const SaleAuctionManagementModal = (activeSales, expiredAuctions, wonAuctions, open, onClose) => {
  const [auctionsToCollect, setAuctionsToCollect] = useState(false)
  const [salesToCancel, setSalesToCancel] = useState(false)
  if (!open) return null;

  return (
    <div className='management-modal__container'>
      <h1>Manage Your Sales and Auctions</h1>
      <div className='management-modal__flex'>
      {expiredAuctions || wonAuctions && 
        <div className='management-modal__flex-item'>
          <h2>Collect Auctions</h2>
          <p>Collect your auctions that have ended.</p>
          <button className='management-modal__button' onClick={() => setAuctionsToCollect(true)}>Collect Auctions</button>
        </div>
      }
      {activeSales && 
        <div className='management-modal__flex-item'>
          <h2>Cancel Sales</h2>
          <p>Cancel your sales that have not ended.</p>
          <button className='management-modal__button' onClick={() => setSalesToCancel(true)}>Cancel Sales</button>
        </div>
      }
        <div className='management-modal__flex-item button'>
          <button className='management-modal__button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default SaleAuctionManagementModal
