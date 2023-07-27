export const approveListNFT = async (nftContract, marketplaceContractAddress, tokenId) => {
    try{
        approvalResponse = await nftContract.approve(marketplaceContractAddress, tokenId);
        approvalReceipt = await approvalResponse.wait();
        console.log("NFT listing approval success", approvalReceipt);
        console.log("Approval status", approvalReceipt.status);
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