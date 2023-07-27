import React, { useState } from 'react'
import { SaleAuctionManagementModal } from '../components'
import { useCheckAuctionCollectSalesCancel } from '../hooks'
import { useEthers, useMarketplace } from '../context'

const AuctionSalesManagementButton = ({ setDisplayButton }) => {
  const { userWalletAddress } = useEthers();
  const { marketplaceContract } = useMarketplace();

  const [isOpen, setIsOpen] = useState(false);

  const { activeSales, expiredAuctions, wonAuctions } = useCheckAuctionCollectSalesCancel(marketplaceContract, userWalletAddress, setDisplayButton);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Manage Auctions/Sales</button>
      <SaleAuctionManagementModal 
        activeSales={activeSales} 
        expiredAuctions={expiredAuctions} 
        wonAuctions={wonAuctions} 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default AuctionSalesManagementButton;
