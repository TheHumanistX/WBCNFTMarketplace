import React, { useState } from 'react'
import { useMarketplace, useNFT } from '../context'
import { auctionCollect } from '../utility'
import { useFetchNftData } from '../hooks'

const SaleAuctionManagementModal = ({ activeSales, expiredAuctions, wonAuctions, open, onClose }) => {
  console.log('Entered SaleAuctionManagementModal... open set to: ', open)

  const { marketplaceContract } = useMarketplace();
  const { nftContract } = useNFT();


  const [auctionsToCollect, setAuctionsToCollect] = useState(false)
  const [salesToCancel, setSalesToCancel] = useState(false)
  const nftData = useFetchNftData(nftContract, tokenId); //! Need to figure out how to work this. tokenId needs to be pulled from activeSales.tokenId, etc.  Need this done in a mapping... 
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



              <button className='management-modal__button' onClick={() => setAuctionsToCollect(true)}>Collect Auctions</button>
            </div>
          }
          {expiredAuctions?.length &&
            <div className='management-modal__flex-item'>
              <h2>Auctions Expired</h2>
              <p>Collect your auctions that have expired.</p>
              <button className='management-modal__button' onClick={() => setAuctionsToCollect(true)}>Collect Auctions</button>
            </div>
          }
          {activeSales?.length &&
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
    </>
  )
}

export default SaleAuctionManagementModal
