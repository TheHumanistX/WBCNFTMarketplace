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
        console.log('buy_nft useListing listing: ', listing)
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
        console.log('buy_nft useListing listing destructured tokenId: ', tokenId)
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
        console.log('destructuredListing: ', destructuredListing)
    } else if (path === '/view_auctions') {
        console.log('Entered view_auctions if statement in useListing hook...')
        console.log('view_auctions useListing listing: ', listing)
        const { 
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
        } = listing;
        console.log('useListing... created `listing` object...')
        const getCurrentBid = async () => {
            const auctionData = await marketplaceContract.getAuction(auctionID)
            console.log('auctionData: ', auctionData)
            const currentBid = ethers.utils.formatEther(auctionData[3])
            console.log('currentBid: ', currentBid)
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
        console.log('destructuredListing: ', destructuredListing)
    }
    
    return destructuredListing;
}
