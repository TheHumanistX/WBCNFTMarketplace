import { ethers } from "ethers";

export const approveNFTTransfer = async (nftContract, marketplaceContractAddress, tokenId) => {
    try{
        const approvalResponse = await nftContract.approve(marketplaceContractAddress, tokenId);
        const approvalReceipt = await approvalResponse.wait();
        if (approvalReceipt.status === 1) {
            const approval = approvalReceipt;
            return approval;
          } else {
            console.log("Approval transaction failed");
            return null;
          }
    }catch(err){
        throw err;
    }
}