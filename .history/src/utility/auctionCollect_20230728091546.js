import { useMarketplace } from "../context"

export const auctionCollect = (auctionId) => {
    const { marketplaceContract } = useMarketplace();

    const auctionCollect = async (auctionId) => {
        try {
            const auctionCollectResponse = await marketplaceContract.endAuction(auctionId);
            const auctionCollectReceipt = await auctionCollectResponse.wait();
            console.info("Contract call successs", auctionCollectReceipt);
            console.log("Auction collect status", auctionCollectReceipt.status);
            return auctionCollectReceipt;
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    return auctionCollect(auctionId);
}