import { ethers } from "ethers";
import { useMarketplace, useToken } from '../context';

export const useTokenSpendApprove = async (listingPrice) => {
    const { marketplaceContractAddress } = useMarketplace();
    const { tokenContract } = useToken();
    try {
        const approvalResponse = await tokenContract.approve(marketplaceContractAddress, listingPrice);
        const approvalReceipt = await approvalResponse.wait();
        console.log("wbc amount approval success", approvalReceipt);
        console.log("Approval status", approvalReceipt.status);
        if (approvalReceipt.status === 1) {
          const approval = approvalReceipt;
          return approval;
        } else {
          console.log("Approval transaction failed");
        }
      } catch (err) {
        console.log("wbc amount approval failure", err);
      }
}