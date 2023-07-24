import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

export function useUsersActiveListings(nftContract, marketplaceContract) {
  const { account: userWalletAddress } = useWeb3React();
  const [activeListings, setActiveListings] = useState([]);

  useEffect(() => {
    if (!userWalletAddress || !nftContract || !marketplaceContract) {
      return;
    }

    const fetchActiveListings = async () => {
      const activeListingsArray = [];
      const lastListingId = /* Fetch last listing id */;
      const lastAuctionId = /* Fetch last auction id */;

      for (let i = 0; i <= Math.max(lastListingId, lastAuctionId); i++) {
        let itemType = await marketplaceContract.call("getItemType", [i]);

        if (itemType === "LISTING" || itemType === "AUCTION") {
          let item = await marketplaceContract.call(
            itemType === "LISTING" ? "getListing" : "getAuction",
            [i]
          );

          if (item.owner.toLowerCase() === userWalletAddress.toLowerCase() && item.status === "ACTIVE") {
            activeListingsArray.push({id: i, type: itemType, item: item});
          }
        }
      }

      setActiveListings(activeListingsArray);
    };

    fetchActiveListings();
  }, [nftContract, marketplaceContract, userWalletAddress]);

  return activeListings;
}
