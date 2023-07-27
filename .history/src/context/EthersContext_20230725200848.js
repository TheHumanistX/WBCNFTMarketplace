import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ETH_NULL_ADDRESS } from "../constants";
import { crazyfacesABI } from '../ABI';
import { MarketplaceProvider, NFTProvider, TokenProvider } from './';

const EthersContext = createContext();

export const EthersProvider = ({ children }) => {

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userWalletAddress, setUserWalletAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [chainName, setChainName] = useState(null);
    const ETHEREUM_NULL_ADDRESS = ETH_NULL_ADDRESS;

    useEffect(() => {
        const ethersDataSetup = async (networkId) => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                console.log('EthersContext provider updated to: ', provider)
                const network = await provider.getNetwork();
                setNetwork(network);
                setChainName(network ? network.name : null);
                setProvider(provider);

                if (networkId === 5) {
                    const signer = provider.getSigner();
                    const walletAddress = await signer.getAddress();
                    console.log('EthersContext walletAddress updated to: ', walletAddress)
                    setSigner(signer);
                    setUserWalletAddress(walletAddress);
                }
                console.log('EthersContext initialized.... Ready for contract interactions....')
            };
        }

        window.ethereum.on('chainChanged', (networkIdHex) => {
            const networkId = parseInt(networkIdHex, 16);
            ethersDataSetup(networkId);
        });

        // Initial setup
        ethersDataSetup(parseInt(window.ethereum.networkVersion, 10));
    }, [provider, userWalletAddress, network]);

    return (
        <EthersContext.Provider value={{
            provider,
            signer,
            userWalletAddress,
            network,
            chainName,
            ETHEREUM_NULL_ADDRESS,
        }}>
            <TokenProvider provider={provider} signer={signer}>
                <MarketplaceProvider provider={provider} signer={signer}>
                    <NFTProvider provider={provider} signer={signer} userWalletAddress={userWalletAddress}>
                        {children}
                    </NFTProvider>
                </MarketplaceProvider>
            </TokenProvider>
        </EthersContext.Provider>
    )
}

export const useEthers = () => {
    return useContext(EthersContext);
}