import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from 'ethers'
// import { useAddress, useContract, useContractEvents, useContractRead, useContractWrite, useNFTBalance } from "@thirdweb-dev/react";
import {  MARKETPLACE_CONTRACT_ADDRESS } from "../constants";
import { marketplaceABI } from "../ABI";

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ provider, signer, children }) => {

  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [cancelOrCollectSuccesful, setCancelOrCollectSuccesful] = useState(false);
  const marketplaceContractAddress = MARKETPLACE_CONTRACT_ADDRESS;

  useEffect(() => {
    if (provider && signer) {
      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceABI, signer);
      setMarketplaceContract(marketplaceContract);
    }
  }, [provider, signer]);
  

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceContract,
        marketplaceContractAddress,
        cancelOrCollectSuccesful,
        setCancelOrCollectSuccesful
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );

}
export const useMarketplace = () => {
  return useContext(MarketplaceContext);
};
