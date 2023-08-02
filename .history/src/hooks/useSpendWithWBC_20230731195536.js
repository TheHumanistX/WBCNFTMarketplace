import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useMarketplace, useToken } from '../context';
import { approveTokenSpend, tokenSpend } from '../utility';

export const useSpendWithWBC = ({ setIsOpen, setModalText }) => {
  const { marketplaceContract, marketplaceContractAddress } = useMarketplace();
  const { tokenContract } = useToken();


  const spendWithWBC = useCallback(async (listingID, value, setTxConfirm, path) => {
    let approval;
    try {
      approval = await approveTokenSpend(value, marketplaceContractAddress, tokenContract);
    } catch (err) {
      setIsOpen(true);
      setModalText(`Error during token approval. Check console for error message.`);
      console.error("Error during token approval:", err);
      return;
    }

    try {
      await tokenSpend({ listingID, marketplaceContract, setTxConfirm, path, approval });
    } catch (err) {
      setIsOpen(true);
      setModalText(`Failed to buy/bid with WBC. Check console for error message.`);
      console.error('Failed to buy/bid with WBC: ', err);
    }
  }, [marketplaceContract, marketplaceContractAddress, tokenContract]);

  return { spendWithWBC };
}
