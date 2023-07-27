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
        let cancelled = false;
    
        const fetchTokenContract = async () => {
            if (provider && signer && !cancelled) {
                const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenABI, signer);
                setTokenContract(tokenContract);
                
                try {
                    const tokenSymbol = await tokenContract.symbol();
                    if (!cancelled) {
                        setTokenSymbol(tokenSymbol);
                    }
                } catch (err) {
                    if (err.code === 'NETWORK_ERROR') {
                        if (!cancelled) {
                            fetchTokenContract();  // network changed, try again
                        }
                    } else {
                        console.error(err);
                    }
                }
            }
        }
        
        fetchTokenContract();
        
        return () => {  // Cleanup function
            cancelled = true;  // If component unmounts, don't try to set state
        };
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
