export const buyListingCheck = ({ owner, userWalletAddress }) => {
    if (owner === userWalletAddress) {
        setModalText('You cannot buy your own listing.');
        console.log('User is the owner of the listing.')
        setIsOpen(true);
        return false;
    }

    return true;
}