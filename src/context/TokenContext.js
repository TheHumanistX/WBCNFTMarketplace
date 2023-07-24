import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS } from "../constants";
import { tokenABI } from '../ABI';

const TokenContext = createContext();

export const TokenProvider = ({ provider, signer, children }) => {

    const [tokenContract, setTokenContract] = useState(null);
    const [tokenSymbol, setTokenSymbol] = useState(null);
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS;

    useEffect(() => {
        if (provider && signer) {
            const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenABI, signer);
            setTokenContract(tokenContract);
            const tokenSymbol = tokenContract.symbol();
            setTokenSymbol(tokenSymbol);
        }
    }, [provider, signer]);

    return (
        <TokenContext.Provider value={{
            tokenContract,
            tokenContractAddress,
            tokenSymbol,
        }}>
            {children}
        </TokenContext.Provider>
    )
}

export const useToken = () => {
    return useContext(TokenContext);
};
