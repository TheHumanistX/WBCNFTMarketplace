import React, { createContext, useState, useEffect } from "react";
import { ethers } from 'ethers'
import { useAddress, useContract, useContractEvents, useContractRead, useContractWrite, useNFTBalance } from "@thirdweb-dev/react";
import { TOKEN_CONTRACT_ADDRESS, ETH_NULL_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from "../constants";

export const MarketplaceContext = createContext();

export const MarketplaceContextProvider = ({ children }) => {

  const [nftContractAddress, setNFTContractAddress] = useState('');

  const userWalletAddress = useAddress();
  const tokenAddress = TOKEN_CONTRACT_ADDRESS;
  const ETHEREUM_NULL_ADDRESS = ETH_NULL_ADDRESS;
  const { contract: tokenContract } = useContract(tokenAddress);
  // const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E'; V1
  // const marketplaceContractAddress = '0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA'; V2
  // const marketplaceContractAddress = '0x0b3A9710005a82C35446eAE8B8F8ba5A77988541'; V3
  // const marketplaceContractAddress = '0xaaAf4305B9A184D72f06198A025c388411506BbC'; V4
  const marketplaceContractAddress = MARKETPLACE_CONTRACT_ADDRESS;
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  const { contract: nftContract } = useContract(nftContractAddress);
  const { data: userNFTBalance } = useNFTBalance(nftContract, userWalletAddress);
  let { data: lastNFTMintedId } = useContractRead(nftContract, "getLastTokenID");
  lastNFTMintedId = lastNFTMintedId ? lastNFTMintedId.toNumber() - 1 : null;
  const { data: nftContractName } = useContractRead(nftContract, "name");
  const { mutateAsync: approveNFTTransfer } = useContractWrite(nftContract, "approve");
  const { data: nftTransferEvents } = useContractEvents(nftContract, "Transfer", {
    queryFilter: {
      order: "dec",
    },
    subscribe: true
  });

  const { data: marketplaceNFTListedEvents } = useContractEvents(marketplaceContract, "ListingCreated", {
    queryFilter: {
      order: "asc",
    },
    subscribe: true
  });

  const { data: marketplaceAuctionCreatedEvents } = useContractEvents(marketplaceContract, "AuctionCreated", {
    queryFilter: {
      order: "asc",
    },
    subscribe: true
  });

  // const { data: nftListingStatus } = useContractRead(marketplaceContract, "getListingStatus", listingID ? [listingID] : [null]);

  return (
    <MarketplaceContext.Provider
      value={{
        userWalletAddress,
        tokenAddress,
        ETHEREUM_NULL_ADDRESS,
        tokenContract,
        lastNFTMintedId,
        marketplaceContractAddress,
        marketplaceContract,
        nftContractAddress,
        setNFTContractAddress,
        nftContract,
        userNFTBalance,
        nftContractName,
        approveNFTTransfer,
        nftTransferEvents,
        marketplaceNFTListedEvents,
        marketplaceAuctionCreatedEvents,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );

}