import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useMarketplace, useToken } from '../context';
import { approveTokenSpend, tokenSpend } from '../utility';

export const useSpendWithWBC = ({ setIsOpen, setModalText }) => {
  const { marketplaceContract, marketplaceContractAddress } = useMarketplace();
  const { tokenContract } = useToken();


  const spendWithWBC = useCallback(async (listingID, value, setTxConfirm, path) => {
    console.log('STEP 2: Entered spendWithWBC in useSpendWithWBC.js...')
    let approval;
    try {
      console.log('STEP 3: Calling approveTokenSpend() in useSpendWithWBC.js...')
      approval = await approveTokenSpend(value, marketplaceContractAddress, tokenContract);
    } catch (err) {
      console.log('**STEP 4: Error during token approval in useSpendWithWBC.js...')
      setIsOpen(true);
      setModalText(`Error during token approval. Check console for error message.`);
      console.error("Error during token approval:", err);
      return;
    }

    try {
      console.log('STEP 4: Calling tokenSpend() in useSpendWithWBC.js...')
      await tokenSpend({ auctionID: listingID, weiBidAmount: value, marketplaceContract, setTxConfirm, path, approval });
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to buy/bid with WBC. Check console for error message.`);
      console.error('Failed to buy/bid with WBC: ', err);
    }
  }, [marketplaceContract, marketplaceContractAddress, tokenContract]);

  return { spendWithWBC };
}
