import { useContext } from 'react'
import { ethers } from 'ethers'
import { useLocation } from "react-router-dom";
import { MarketplaceContext } from '../context/MarketplaceContext';

export const useListing = (listing, paymentMethodSymbol, formattedPrice) => {
    const { marketplaceContract } = useContext(MarketplaceContext)
    const location = useLocation();
    const path = location.pathname;

    let destructuredListing = {};

    if (path === '/buy_nft') {
        console.log('buy_nft useListing listing: ', listing)
        const { listingID, nftContractAddress, owner, price, formattedPrice, paymentMethodSymbol, paymentContractAddress, tokenID: tokenId } = listing;
        console.log('buy_nft useListing listing destructured tokenId: ', tokenId)
        destructuredListing = { listingID, nftContractAddress, owner, price, formattedPrice, paymentMethodSymbol, paymentContractAddress, tokenId };
        console.log('destructuredListing: ', destructuredListing)
    } else if (path === '/view_auctions') {
        console.log('Entered view_auctions if statement in useListing hook...')
        const { owner, nftContractAddress, auctionID, tokenId, paymentContractAddress, initialBid, beginDate, expiration, formattedInitialBid, formattedPriceSymbol, formattedBeginDate, formattedExpiration, minBidIncrement, currentBid, formattedMinBidIncrement, formattedCurrentBid } = listing;
        
        const getCurrentBid = async () => {
            const auctionData = await marketplaceContract.call('getAuction', [auctionID])
            console.log('auctionData: ', auctionData)
            const currentBid = ethers.utils.formatEther(auctionData[3])
            console.log('currentBid: ', currentBid)
        }
        getCurrentBid();
        destructuredListing = { owner, nftContractAddress, auctionID, tokenId, paymentContractAddress, initialBid, beginDate, expiration, formattedInitialBid, formattedPriceSymbol, formattedBeginDate, formattedExpiration, minBidIncrement, currentBid, formattedMinBidIncrement, formattedCurrentBid };
    }
    
    return destructuredListing;
}
