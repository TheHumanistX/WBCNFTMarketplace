import React, { useState } from 'react'
import { useNFT } from '../context'
import { auctionCollect } from '../utility'
import { ShowCollectibleNFTs } from '../components'


const SaleAuctionManagementModal = ({ activeSales, expiredAuctions, wonAuctions, open, onClose }) => {
  
  if (!open) return null;

  return (
    <>
      <div className='management-modal__overlay' />
      <div className='management-modal__container'>
        <h1>Manage Your Sales and Auctions</h1>
        <div className='management-modal__flex'>
          {wonAuctions?.length > 0 &&
            <div className='management-modal__flex-item'>
              <h2>Auctions Won</h2>
              <p>Collect your auctions that you have won.</p>
              {wonAuctions.map((auction, index) => 
                  <ShowCollectibleNFTs key={index} listing={auction} status={1} />
                )
              }
            </div>
          }
          {expiredAuctions?.length > 0 &&
            <div className='management-modal__flex-item'>
              <h2>Auctions Expired</h2>
              <p>Collect your auctions that have expired.</p>
              {expiredAuctions.map((auction, index) => 
                  <ShowCollectibleNFTs key={index} listing={auction} status={2}/>
                )
              }
            </div>
          }
          {activeSales?.length > 0 &&
            <div className='management-modal__flex-item'>
              <h2>Cancel Sales</h2>
              <p>Cancel your sales that have not ended.</p>
              {activeSales.map((sale, index) => 
                  <ShowCollectibleNFTs key={index} listing={sale} status={3}/>
                )
              }
            </div>
          }
        </div>
          <div className='management-modal__close-button'>
            <div onClick={onClose}>X</div>
          </div>
      </div>
    </>
  )
}

export default SaleAuctionManagementModal