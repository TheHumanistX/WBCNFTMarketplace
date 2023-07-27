export const bidOnAuctionInputChecks = (bidAmount, minBidIncrement, setIsOpen, setModalText) => {
    if (isNaN(bidAmount) || bidAmount === '' || bidAmount <= 0) {
        setModalText('Please enter a valid bid amount.');
        console.log('bidAmount is NaN or empty string.')
        setIsOpen(true);
        return false;
      }

      if (parseFloat(bidAmount) < parseFloat(minBidIncrement + bidAmount)) {
        setModalText('Bid amount must be greater than or equal to the minimum bid amount.');
        console.log('Bid amount is less than minBidIncrement.')
        setIsOpen(true);
        return false;
      }

      return true;
}