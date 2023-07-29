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
            try {

                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    console.log('EthersContext provider updated to: ', provider)
                    const network = await provider.getNetwork();
                    setNetwork(network);
                    setChainName(network ? network.name : null);
                    setProvider(provider);

                    if (networkId === 5) {
                        try {
                            const signer = provider.getSigner();
                            const walletAddress = await signer.getAddress();
                            console.log('EthersContext walletAddress updated to: ', walletAddress)
                            setSigner(signer);
                            setUserWalletAddress(walletAddress);
                        } catch (error) {
                            if (error.code === 4001) {
                                // User rejected request
                                console.log("User rejected request");
                                // Add some user-friendly notification logic here
                            } else {
                                console.error(error);
                            }
                        }
                    }
                    
                    console.log('EthersContext initialized.... Ready for contract interactions....')
                };
            } catch (err) {
                if (err.message.includes('unknown account #0')) {
                    // Handle error due to MetaMask being locked
                    console.log("Metamask is locked. Please unlock and reconnect.");
                    setUserWalletAddress(null);
                    setSigner(null);
                    setProvider(null);
                }
            }
        }

            window.ethereum.on('chainChanged', (networkIdHex) => {
                const networkId = parseInt(networkIdHex, 16);
                ethersDataSetup(networkId);
            });

            window.ethereum.on('accountsChanged', async (accounts) => {
                console.log('EthersContext accountsChanged entered on account change...')
                if (accounts.length === 0) {
                    console.log('Please connect to MetaMask.');
                    alert('Your MetaMask is not connected anymore. Please unlock or reconnect.'); // display an alert
                    // handle account disconnection...
                    setUserWalletAddress(null);
                    setSigner(null);
                } else if (accounts[0] !== userWalletAddress) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    console.log('EthersContext accountsChanged provider: ', provider)
                    try {
                        const signer = await provider.getSigner();
                        const walletAddress = await signer.getAddress();
                        console.log('EthersContext walletAddress updated to: ', walletAddress)
                        setSigner(signer);
                        setUserWalletAddress(walletAddress);
                    } catch (err) {
                        console.error(err);
                        alert('Error when getting wallet address. Please check your MetaMask connection.');
                        setUserWalletAddress(null);
                        setSigner(null);
                    }
                }
            });


            // Initial setup
            ethersDataSetup(parseInt(window.ethereum.networkVersion, 10));
        }, []);

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