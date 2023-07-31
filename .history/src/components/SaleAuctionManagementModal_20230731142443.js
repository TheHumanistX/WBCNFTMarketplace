import React from 'react'
import { ShowCollectibleNFTs } from '../components'

const ListingSection = ({ title, description, listings, status }) => (
  <div className='management-modal__flex-item'>
    <h2>{title}</h2>
    <p>{description}</p>
    {listings.map((listing, index) =>
      <ShowCollectibleNFTs key={index} listing={listing} status={status} />
    )}
  </div>
);

const SaleAuctionManagementModal = ({ activeSales, expiredAuctions, wonAuctions, open, onClose }) => {

  if (!open) return null;

  return (
    <>
      <div className='management-modal__overlay' />
      <div className='management-modal__container'>
        <h1>Manage Your Sales and Auctions</h1>
        <div className='management-modal__flex'>
          {wonAuctions?.length > 0 &&
            <ListingSection
              title="Auctions Won"
              description="Collect your auctions that you have won."
              listings={wonAuctions}
              status={1}
            />
          }
          {expiredAuctions?.length > 0 &&
            <ListingSection
              title="Auctions Expired"
              description="Collect your auctions that have expired."
              listings={expiredAuctions}
              status={2}
            />
          }
          {activeSales?.length > 0 &&
            <ListingSection
              title="Cancel Sales"
              description="Cancel your sales that have not ended."
              listings={activeSales}
              status={3}
            />
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
