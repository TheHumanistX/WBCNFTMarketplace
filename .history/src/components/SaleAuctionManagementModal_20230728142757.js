import React, { useState } from 'react'
import { useNFT } from '../context'
import { auctionCollect } from '../utility'
import { ShowCollectibleNFTs } from '../components'


const SaleAuctionManagementModal = ({ activeSales, expiredAuctions, wonAuctions, open, onClose }) => {
  console.log('Entered SaleAuctionManagementModal... open set to: ', open)


  const [auctionsToCollect, setAuctionsToCollect] = useState(false)
  const [salesToCancel, setSalesToCancel] = useState(false)


  if (!open) return null;
  console.log('SaleAuctionManagementModal wonAuctions: ', wonAuctions)
  return (
    <>
      <div className='management-modal__overlay' />
      <div className='management-modal__container'>
        <h1>Manage Your Sales and Auctions</h1>
        <div className='management-modal__flex'>
          {wonAuctions?.length &&
            <div className='management-modal__flex-item'>
              <h2>Auctions Won</h2>
              <p>Collect your auctions that you have won.</p>
              {wonAuctions &&
                wonAuctions.map((auction, index) => {
                  <ShowCollectibleNFTs key={index} auction={auction} />
                })
              }
              <button className='management-modal__button' onClick={() => setAuctionsToCollect(true)}>Collect Auctions</button>
            </div>
          }
          {expiredAuctions?.length &&
            <div className='management-modal__flex-item'>
              <h2>Auctions Expired</h2>
              <p>Collect your auctions that have expired.</p>
              {expiredAuctions &&
                expiredAuctions.map((auction, index) => {
                  <ShowCollectibleNFTs key={index} auction={auction} />
                })
              }
            </div>
          }
          {activeSales?.length &&
            <div className='management-modal__flex-item'>
              <h2>Cancel Sales</h2>
              <p>Cancel your sales that have not ended.</p>
              {activeSales &&
                activeSales.map((sale, index) => {
                  <ShowCollectibleNFTs key={index} sale={sale} />
                })
              }
            </div>
          }
          <div className='management-modal__flex-item button'>
            <button className='management-modal__button' onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SaleAuctionManagementModal
