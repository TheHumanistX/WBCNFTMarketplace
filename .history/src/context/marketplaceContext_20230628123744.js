import React, { createContext, useState, useEffect } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";

export const MarketplaceContext = createContext();

export const MarketplaceContextProvider = ({ children }) => {

    const [nftContractAddress, setNFTContractAddress] = useState('');
    const [ownedNFTs, setOwnedNFTs] = useState([])

    const userWalletAddress = useAddress();
    const marketplaceContractAddress = '0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA';
    const { contract: marketplaceContract } = useContract(marketplaceContractAddress);

    return (
        <MarketplaceContext.Provider
            value={{
                userWalletAddress,
                marketplaceContractAddress,
                marketplaceContract,
                nftContractAddress, 
                setNFTContractAddress,
                ownedNFTs, 
                setOwnedNFTs,
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    );

}