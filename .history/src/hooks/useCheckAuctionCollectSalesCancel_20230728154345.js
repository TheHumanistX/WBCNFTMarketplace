import { useEffect, useState } from "react"
import { useEthers, useMarketplace } from '../context';

export const useCheckAuctionCollectSalesCancel = (setDisplayButton) => {

    const { ETHEREUM_NULL_ADDRESS, userWalletAddress } = useEthers();
    const { marketplaceContract, cancelOrCollectSuccesful } = useMarketplace();
   

    const [activeSales, setActiveSales] = useState([]);
    const [expiredAuctions, setExpiredAuctions] = useState([]);
    const [wonAuctions, setWonAuctions] = useState([]);

    useEffect(() => {
        if (!marketplaceContract) return;
        const checkAuctionCollectSalesCancel = async () => {
            let lastListingId = await marketplaceContract.idCounter();
            lastListingId = lastListingId.toNumber();

            const listingData = await Promise.all(
                // !
                // ! May need to change to `=> i + 1` if having issues with listingIds lining up
                // !
                Array.from({ length: lastListingId }, (_, i) => i).map(async (listingId) => {
                    const listingType = await marketplaceContract.getItemType(listingId)
                    return {
                        listingId: listingId,
                        listingType: listingType
                    };
                })
            );

            const usersActiveSales = [];
            const usersExpiredAuctions = [];
            const usersWonAuctions = [];

            for (const listing of listingData) {
                let currentStatus;
                let currentOwner;
                let tokenId;
                let nftContractAddress;

                if (listing.listingType === 1) { // sale
                    currentStatus = await marketplaceContract.getListingStatus(listing.listingId);
                    currentOwner = (await marketplaceContract.getListing(listing.listingId)).owner;
                    tokenId = ((await marketplaceContract.getListing(listing.listingId)).tokenID).toNumber();
                    nftContractAddress = (await marketplaceContract.getListing(listing.listingId)).nftContract;
                } else if (listing.listingType === 2) { // auction
                    currentStatus = await marketplaceContract.getAuctionStatus(listing.listingId);
                    currentOwner = (await marketplaceContract.getAuction(listing.listingId)).owner;
                    tokenId = ((await marketplaceContract.getAuction(listing.listingId)).tokenID).toNumber();
                    nftContractAddress = (await marketplaceContract.getAuction(listing.listingId)).nftContract;
                }

                if (currentOwner === userWalletAddress) {
                    if (listing.listingType === 1 && currentStatus === 1) {
                        usersActiveSales.push({listingId:listing.listingId, tokenId:tokenId, nftContractAddress: nftContractAddress});
                    } else if (listing.listingType === 2 && currentStatus === 3 && (await marketplaceContract.getAuction(listing.listingId)).topBidder === ETHEREUM_NULL_ADDRESS) {

                        usersExpiredAuctions.push({listingId:listing.listingId, tokenId:tokenId, nftContractAddress: nftContractAddress});
                    }
                } else if (currentStatus === 4 && (await marketplaceContract.getAuction(listing.listingId)).topBidder === userWalletAddress) {
                    usersWonAuctions.push({listingId:listing.listingId, tokenId:tokenId, nftContractAddress: nftContractAddress});
                }
            }


            setActiveSales(usersActiveSales);
            console.log('usersActiveSales: ', usersActiveSales)
            setExpiredAuctions(usersExpiredAuctions);
            console.log('usersExpiredAuctions: ', usersExpiredAuctions)
            setWonAuctions(usersWonAuctions);
            console.log('usersWonAuctions: ', usersWonAuctions)
        }
        checkAuctionCollectSalesCancel();
    }, [marketplaceContract, userWalletAddress, cancelOrCollectSuccesful]);

    useEffect(() => {
        setDisplayButton(activeSales.length > 0 || expiredAuctions.length > 0 || wonAuctions.length > 0);
    }, [activeSales, expiredAuctions, wonAuctions]);

    return {
        activeSales,
        expiredAuctions,
        wonAuctions
    };
}
