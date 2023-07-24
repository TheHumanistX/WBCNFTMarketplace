import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS, ETH_NULL_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from "../constants";
import { crazyfacesABI, marketplaceABI, tokenABI } from '../ABI';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    return (
        <TokenContext.Provider value={{
        }}>
            {children}
        </TokenContext.Provider>
    )
}