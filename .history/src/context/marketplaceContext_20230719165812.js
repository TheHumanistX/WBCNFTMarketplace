import React, { createContext, useState, useEffect } from "react";
import { ethers } from 'ethers'
// import { useAddress, useContract, useContractEvents, useContractRead, useContractWrite, useNFTBalance } from "@thirdweb-dev/react";
import {  MARKETPLACE_CONTRACT_ADDRESS } from "../constants";
import { marketplaceABI } from "../ABI";

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ provider, signer, children }) => {

  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const marketplaceContractAddress = MARKETPLACE_CONTRACT_ADDRESS;

  useEffect(() => {
    if (provider && signer) {
      const marketplaceContract = new ethers.Contract(MARKETPLACE_CONTRACT_ADDRESS, marketplaceABI, signer);
      setMarketplaceContract(marketplaceContract);
    }
  }, [provider, signer]);
  // const [nftContractAddress, setNFTContractAddress] = useState('');

  // const userWalletAddress = useAddress();
  // const tokenContractAddress = TOKEN_CONTRACT_ADDRESS;
  // const ETHEREUM_NULL_ADDRESS = ETH_NULL_ADDRESS;
  // const { contract: tokenContract } = useContract(tokenContractAddress);
  // const marketplaceContractAddress = MARKETPLACE_CONTRACT_ADDRESS;
  // const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  // const { contract: nftContract } = useContract(nftContractAddress);
  // const { data: userNFTBalance } = useNFTBalance(nftContract, userWalletAddress);
  // let { data: lastNFTMintedId } = useContractRead(nftContract, "getLastTokenID");
  // lastNFTMintedId = lastNFTMintedId ? lastNFTMintedId.toNumber() - 1 : null;
  // const { data: nftContractName } = useContractRead(nftContract, "name");
  // const { mutateAsync: approveNFTTransfer } = useContractWrite(nftContract, "approve"); //! Didn't add to new context yet... will probably move to utility or hook

  // //! Did not add events to EthersContext. WIll move these to hooks or utility functions
  // const { data: nftTransferEvents } = useContractEvents(nftContract, "Transfer", {
  //   queryFilter: {
  //     order: "dec",
  //   },
  //   subscribe: true
  // });

  // const { data: marketplaceNFTListedEvents } = useContractEvents(marketplaceContract, "ListingCreated", {
  //   queryFilter: {
  //     order: "asc",
  //   },
  //   subscribe: true
  // });

  // const { data: marketplaceAuctionCreatedEvents } = useContractEvents(marketplaceContract, "AuctionCreated", {
  //   queryFilter: {
  //     order: "asc",
  //   },
  //   subscribe: true
  // });

  // const { data: nftListingStatus } = useContractRead(marketplaceContract, "getListingStatus", listingID ? [listingID] : [null]);

  return (
    <MarketplaceContext.Provider
      value={{
        // userWalletAddress,
        // tokenContractAddress,
        // ETHEREUM_NULL_ADDRESS,
        // tokenContract,
        // lastNFTMintedId,
        // marketplaceContractAddress,
        // marketplaceContract,
        // nftContractAddress,
        // setNFTContractAddress,
        // nftContract,
        // userNFTBalance,
        // nftContractName,
        // approveNFTTransfer,
        // nftTransferEvents,
        // marketplaceNFTListedEvents,
        // marketplaceAuctionCreatedEvents,
        marketplaceContract,
        marketplaceContractAddress
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );

}
export const useMarketplace = () => {
  return useContext(MarketplaceContext);
};
