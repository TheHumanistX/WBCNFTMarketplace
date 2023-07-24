import { useLocation } from "react-router-dom";

export const useListing = (listing, paymentMethodSymbol, formattedPrice) => {
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
        const { owner, nftContractAddress, auctionID, tokenId, paymentContractAddress, initialBid, beginDate, expiration, formattedInitialBid, formattedPriceSymbol, formattedBeginDate, formattedExpiration, bidIncrement, currentBid, formattedMinBidIncrement, formattedCurrentBid } = listing;
        destructuredListing = { owner, nftContractAddress, auctionID, tokenId, paymentContractAddress, initialBid, beginDate, expiration, formattedInitialBid, formattedPriceSymbol, formattedBeginDate, formattedExpiration, bidIncrement, currentBid, formattedMinBidIncrement, formattedCurrentBid };
    }
    
    return destructuredListing;
}
