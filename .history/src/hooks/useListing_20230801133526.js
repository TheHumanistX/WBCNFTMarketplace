import { useContext } from 'react'
import { ethers } from 'ethers'
import { useLocation } from "react-router-dom";
import { useMarketplace } from '../context';

export const useListing = (listing, paymentMethodSymbol, formattedPrice) => {
    const { marketplaceContract } = useMarketplace();
    const location = useLocation();
    const path = location.pathname;
    
    let destructuredListing = {};
    
    if (path === '/buy_nft') {
        const { 
            listingID, 
            nftContractAddress, 
            owner, 
            price, 
            formattedPrice, 
            paymentMethodSymbol, 
            paymentContractAddress, 
            tokenID: tokenId 
        } = listing;
        
        destructuredListing = { 
            listingID, 
            nftContractAddress, 
            owner, 
            price, 
            formattedPrice, 
            paymentMethodSymbol, 
            paymentContractAddress, 
            tokenId 
        };
        
    } else if (path === '/view_auctions') {
        
        const { 
            owner, 
            nftContractAddress, 
            auctionID, 
            tokenID: tokenId, 
            paymentContractAddress,  
            beginDate, 
            expiration, 
            formattedPriceSymbol, 
            formattedBeginDate, 
            formattedExpiration, 
            minBidIncrement, 
            currentBid, 
            formattedMinBidIncrement, 
            formattedCurrentBid 
        } = listing;
        
        const getCurrentBid = async () => {
            const auctionData = await marketplaceContract.getAuction(auctionID)
            const currentBid = ethers.utils.formatEther(auctionData[3])
            
        }
        getCurrentBid();
        destructuredListing = { 
            owner, 
            nftContractAddress, 
            auctionID, 
            tokenId, 
            paymentContractAddress, 
            beginDate, 
            expiration, 
            formattedPriceSymbol, 
            formattedBeginDate, 
            formattedExpiration, 
            minBidIncrement, 
            currentBid, 
            formattedMinBidIncrement, 
            formattedCurrentBid 
        };
    }
    
    return destructuredListing;
}
