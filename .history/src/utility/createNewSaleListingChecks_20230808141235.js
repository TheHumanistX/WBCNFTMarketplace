export const createNewSaleListingChecks = (listingDetails, setIsOpen, setModalText) => {
    if (isNaN(listingDetails.price) || listingDetails.price === '' || listingDetails.price <= 0) {
        setIsOpen(true);
        setModalText('Please enter a valid price.');
        // setCreateAuctionCheckFailed(true);
        return false;
    }

    return true;
}