import React, { useState } from 'react';
import { SaleAuctionManagementModal } from './';

const AuctionSalesManagementButton = ({ activeSales, expiredAuctions, wonAuctions, setDisplayButton }) => {
  const [isOpen, setIsOpen] = useState(false);
    console.log('AuctionSalesManagementButton rendered, isOpen set to: ', isOpen)
  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <>
      <div className='auction-sales-management-button' onClick={() => setIsOpen(true)}>Manage Auctions/Sales</div>
      <SaleAuctionManagementModal 
        activeSales={activeSales} 
        expiredAuctions={expiredAuctions} 
        wonAuctions={wonAuctions} 
        open={isOpen} 
        onClose={handleClose}
      />
    </>
  );
}

export default AuctionSalesManagementButton;
