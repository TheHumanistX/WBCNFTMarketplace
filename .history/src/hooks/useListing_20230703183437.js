import { useLocation } from "react-router-dom";

export const useListing = (listing, paymentMethodSymbol, formattedPrice) => {
    const location = useLocation();
    const path = location.pathname;

    let destructuredListing = {};

    if (path === '/buy_nft') {
        const { listingID, nftContractAddress, owner, price, formattedPrice, paymentMethodSymbol, paymentContractAddress, tokenId } = listing;
        
        destructuredListing = { listingID, nftContractAddress, owner, price, formattedPrice, paymentMethodSymbol, paymentContractAddress, tokenId };
    } else if (path === '/view_auctions') {
        const { owner, nftContractAddress, auctionID, tokenId, paymentContractAddress, initialBid, beginDate, expiration, formattedInitialBid, formattedPriceSymbol, bidIncrement } = listing;
        destructuredListing = { owner, nftContractAddress, auctionID, tokenId, paymentContractAddress, initialBid, beginDate, expiration, formattedInitialBid, formattedPriceSymbol, bidIncrement };
    }
    
    return destructuredListing;
}
