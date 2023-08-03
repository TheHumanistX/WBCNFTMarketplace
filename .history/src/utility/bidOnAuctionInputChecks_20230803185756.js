export const bidOnAuctionInputChecks = (bidAmount, minimumAllowableBid, owner, userWalletAddress, setIsOpen, setModalText) => {
  if (isNaN(bidAmount) || bidAmount === '' || bidAmount <= 0) {
    setModalText('Please enter a valid bid amount.');
    console.log('bidAmount is NaN or empty string.')
    setIsOpen(true);
    return false;
  }

  if (parseFloat(bidAmount) < minimumAllowableBid) {
    setModalText('Bid amount must be greater than or equal to the minimum bid amount.');
    console.log('Bid amount is less than minBidIncrement.')
    setIsOpen(true);
    return false;
  }

  if (owner === userWalletAddress) {
    setModalText('You cannot bid on your own auction.');
    console.log('User is the owner of the auction.')
    setIsOpen(true);
    return false;
  }

  return true;
}