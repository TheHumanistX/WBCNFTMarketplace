import React, { createContext, useState, useEffect } from "react";
import { useAddress, useContract, useContractEvents, useContractRead, useContractWrite, useNFTBalance } from "@thirdweb-dev/react";

export const MarketplaceContext = createContext();

export const MarketplaceContextProvider = ({ children }) => {

  const [nftContractAddress, setNFTContractAddress] = useState('');
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [listingID, setListingID] = useState('');

  const userWalletAddress = useAddress();
  const tokenAddress = '0xFB29697113015019c42E90fdBC94d9B4898D2602';
  const tokenContract = useContract(tokenAddress);
  const marketplaceContractAddress = '0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA';
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  const { contract: nftContract } = useContract(nftContractAddress);
  const { data: userNFTBalance } = useNFTBalance(nftContract, userWalletAddress);
  const { data: nftContractName } = useContractRead(nftContract, "name");
  const { mutateAsync: approveNFTTransfer } = useContractWrite(nftContract, "approve");
  const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")
  const { data: nftTransferEvents } = useContractEvents(nftContract, "Transfer", {
    queryFilter: {
      order: "asc",
    },
    subscribe: true
  });

  const { data: marketplaceNFTListedEvents } = useContractEvents(marketplaceContract, "ListingCreated", {
    queryFilter: {
      order: "asc",
    },
    subscribe: true
  });

  const { data: nftListingStatus } = useContractRead(marketplaceContract, "getListingStatus", listingID ? [listingID] : []);

  return (
    <MarketplaceContext.Provider
      value={{
        userWalletAddress,
        tokenAddress,
        marketplaceContractAddress,
        marketplaceContract,
        nftContractAddress,
        setNFTContractAddress,
        nftContract,
        userNFTBalance,
        nftContractName,
        approveNFTTransfer,
        createListing,
        nftTransferEvents,
        marketplaceNFTListedEvents,
        ownedNFTs,
        setOwnedNFTs,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );

}