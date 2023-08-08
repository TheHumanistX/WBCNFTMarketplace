export const createNewSaleListingChecks = () => {
    if (isNaN(listingDetails.price) || listingDetails.price === '' || listingDetails.price <= 0) {
        setIsOpen(true);
        setModalText('Please enter a valid initial bid amount.');
        // setCreateAuctionCheckFailed(true);
        return false;
    }

    return true;
}