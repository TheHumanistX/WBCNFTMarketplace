import { useEffect } from "react"

export const useCheckAuctionCollectSalesCancel = async (marketplaceContract, userWalletAddress) => {
    useEffect(() => {
        const checkAuctionCollectSalesCancel = async () => {
            let lastListingId = await marketplaceContract.idCounter();
            lastListingId = lastListingId.toNumber();
        }
        checkAuctionCollectSalesCancel();
    }, []);

}