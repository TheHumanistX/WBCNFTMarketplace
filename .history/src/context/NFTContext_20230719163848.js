import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS, ETH_NULL_ADDRESS } from "../constants";
import { crazyfacesABI } from '../ABI';

const NFTContext = createContext();

export const NFTProvider = ({ provider, signer, children }) => {

    const [nftContractAddress, setNFTContractAddress] = useState('');
    const [nftContract, setNFTContract] = useState(null);
    const [userNFTBalance, setUserNFTBalance] = useState(null);
    const [lastNFTMintedId, setLastNFTMintedId] = useState(null);
    const [nftContractName, setNFTContractName] = useState(null);

    useEffect(() => {
        if (provider && signer) {

        }
    }, [provider, signer]);

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