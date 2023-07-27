export const createAuctionInputChecks = (auctionDetails, setIsOpen, setModalText) => {
    if (isNaN(auctionDetails.initialBidAmount) || auctionDetails.initialBidAmount === '' || auctionDetails.initialBidAmount <= 0) {
        setIsOpen(true);
        setModalText('Please enter a valid initial bid amount.');
        // setCreateAuctionCheckFailed(true);
        return false;
    }

    if (isNaN(auctionDetails.bidIncrement) || auctionDetails.bidIncrement === '' || auctionDetails.bidIncrement <= 0) {
        setIsOpen(true);
        setModalText('Please enter a valid bid increment amount.');
        // setCreateAuctionCheckFailed(true);
        return false;
    }
  
    if (auctionDetails.auctionBeginTime === '' || auctionDetails.auctionEndTime === '') {
        setIsOpen(true);
        setModalText('Please provide both a beginning and ending time for the auction.');
        // setCreateAuctionCheckFailed(true);
        return false;
    }

    const now = new Date();

    if (new Date(auctionDetails.auctionBeginTime) < now || new Date(auctionDetails.auctionEndTime) < now) {
        setIsOpen(true);
        setModalText('Both the beginning and ending time for the auction must be in the future.');
        // setCreateAuctionCheckFailed(true);
        return false;
    }

    return true;
}