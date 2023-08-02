import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useMarketplace } from '../context';
import { ethSpend } from '../utility';

export const useSpendWithETH = ({ setIsOpen, setModalText }) => {
    const { marketplaceContract } = useMarketplace();

    const spendWithETH = useCallback(async (listingID, value, setTxConfirm, path) => {
        try {
            await ethSpend({ listingID, weiValue, marketplaceContract, setTxConfirm, path });
            console.log('Buy/Bid placed with ETH!');
        } catch (err) {
            setIsOpen(true);
            setModalText(`Failed to buy/bid with ETH. Check console for error message.`);
            console.error('Failed to buy/bid with ETH: ', err.message);
        }
    }, [marketplaceContract]);

    return { spendWithETH };
}
