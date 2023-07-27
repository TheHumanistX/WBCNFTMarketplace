import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS } from "../constants";
import { tokenABI } from '../ABI';

const TokenContext = createContext();

export const TokenProvider = ({ provider, signer, children }) => {

    const [tokenContract, setTokenContract] = useState(null);
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS;

    useEffect(() => {
        if (provider && signer) {
            const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenABI, signer);
            setTokenContract(tokenContract);
        }
    }, [provider, signer]);

    return (
        <TokenContext.Provider value={{
            tokenContract,
            tokenContractAddress,
        }}>
            {children}
        </TokenContext.Provider>
    )
}