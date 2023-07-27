import React from 'react'
import { useEthers, useMarketplace } from '../context';

const AuctionClaim = () => {

const { marketplaceContract } = useMarketplace();

    useEffect(() => {
        const fetchClaimableAuctions = async () => {
            if(!marketplaceContract) return;
        }
        fetchClaimableAuctions();
    }, []);

  return (
    <div>
      
    </div>
  )
}

export default AuctionClaim
