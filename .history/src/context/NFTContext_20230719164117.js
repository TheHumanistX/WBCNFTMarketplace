import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { crazyfacesABI } from '../ABI';

const NFTContext = createContext();

export const NFTProvider = ({ provider, signer, children }) => {

    const [nftContractAddress, setNFTContractAddress] = useState('');
    const [nftContract, setNFTContract] = useState(null);
    const [userNFTBalance, setUserNFTBalance] = useState(null);
    const [lastNFTMintedId, setLastNFTMintedId] = useState(null);
    const [nftContractName, setNFTContractName] = useState(null);

    useEffect(() => {
        const nftContractSetup = async () => {
            if (nftContractAddress && provider && signer) {
                const nftContract = new ethers.Contract(nftContractAddress, crazyfacesABI, signer);
                setNFTContract(nftContract);
                const userNFTBalance = await nftContract.balanceOf(userWalletAddress);
                setUserNFTBalance(userNFTBalance);
                const lastNFTMintedId = await nftContract.getLastTokenID();
                setLastNFTMintedId(lastNFTMintedId);
                const nftContractName = await nftContract.name();
                setNFTContractName(nftContractName);
            }
        }
        nftContractSetup();
    }, [nftContractAddress, provider, signer]);

    return (
        <NFTContext.Provider value={{
            nftContractAddress,
            setNFTContractAddress,
            nftContract,
            userNFTBalance,
            lastNFTMintedId,
            nftContractName,
        }}>
            {children}
        </NFTContext.Provider>
    )
}