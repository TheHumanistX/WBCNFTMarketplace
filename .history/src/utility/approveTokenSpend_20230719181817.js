import { ethers } from "ethers";

export const approveTokenSpend = async (tokenAmount, marketplaceContractAddress, tokenContract) => {
  
  try {
      const approvalResponse = await tokenContract.approve(marketplaceContractAddress, tokenAmount);
      const approvalReceipt = await approvalResponse.wait();
      console.log("wbc amount approval success", approvalReceipt);
      console.log("Approval status", approvalReceipt.status);
      if (approvalReceipt.status === 1) {
        const approval = approvalReceipt;
        return approval;
      } else {
        console.log("Approval transaction failed");
        return null;
      }
    } catch (err) {
      console.log("wbc amount approval failure", err);
      throw err;
    }
}