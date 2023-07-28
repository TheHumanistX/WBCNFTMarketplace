import React, { useState } from 'react';
import SaleAuctionManagementModal from './SaleAuctionManagementModal';

const AuctionSalesManagementButton = ({ activeSales, expiredAuctions, wonAuctions, setDisplayButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setDisplayButton(false);  // This line will hide the button after closing the modal.
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