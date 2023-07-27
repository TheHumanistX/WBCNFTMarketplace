export const approveTokenSpend = async (marketplaceContractAddress, weiBidAmount) => {
    const weiBidAmount = ethers.utils.parseEther(bidAmount);
    let approval;
    try {
      approval = await approve({ args: [marketplaceContractAddress, weiBidAmount] });
      console.log("wbc amount approval success", approval);
      return approval;
    } catch (error) {
      console.log("wbc amount approval failure", error);
    }
}