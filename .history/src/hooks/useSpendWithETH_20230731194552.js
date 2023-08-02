import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useEthers, useMarketplace } from '../context';
import { ethSpend } from '../utility';

export const useSpendWithETH = ({ setIsOpen, setModalText }) => {
    const { marketplaceContract } = useMarketplace();
    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');

    const spendWithETH = useCallback(async (value, listingID, setTxConfirm, path) => {
        const weiValue = ethers.utils.parseEther(value, 'ether');

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
