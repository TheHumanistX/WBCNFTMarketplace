import { useLocation } from "react-router-dom";

export const useListing(listing) {
    const location = useLocation();
    const path = location.pathname;

    let destructuredListing = {};

    if (path === '/buy_nft') {
        const { listingID, nftContractAddress, owner, price, paymentContractAddress, tokenID: tokenId } = listing;
        destructuredListing = { listingID, nftContractAddress, owner, price, formattedPrice, paymentMethodSymbol, paymentContractAddress, tokenId };
    } else if (path === '/view_auctions') {
        const { auctionID, nftContractAddress, owner, initialBid, bidIncrement, paymentContractAddress, tokenId } = listing;
        destructuredListing = { auctionID, nftContractAddress, owner, initialBid, bidIncrement, paymentContractAddress, tokenId };
    }
    
    return destructuredListing;
}
