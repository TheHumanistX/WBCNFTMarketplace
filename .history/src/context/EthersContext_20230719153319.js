import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS, ETH_NULL_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from "../constants";

const EthersContext = createContext();

export const EthersProvider = ({ children }) => {

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userWalletAddress, setUserWalletAddress] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [crazyFacesContract, setCrazyFacesContract] = useState(null);
    const [mintContract, setMintContract] = useState(null);
    const [chainName, setChainName] = useState(null);
    const [network, setNetwork] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);
    const [formattedTokenBalance, setFormattedTokenBalance] = useState(null);
    const [decimals, setDecimals] = useState(null);
    const [canMint, setCanMint] = useState(false);
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS;
    const marketplaceContractAddress = MARKETPLACE_CONTRACT_ADDRESS;
    const ETHEREUM_NULL_ADDRESS = ETH_NULL_ADDRESS;

    useEffect(() => {
        const ethersDataSetup = async (networkId) => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const network = await provider.getNetwork();
                setNetwork(network);
                setChainName(network ? network.name : null);
                setProvider(provider);
                
                if (networkId === 5) {
                const signer = provider.getSigner();
                const walletAddress = await signer.getAddress();
                const tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, signer);
                const crazyFacesContract = new ethers.Contract(nftContractAddress, nftABI, signer);
                const mintContract = new ethers.Contract(mintingContractAddress, mintABI, signer);
                setSigner(signer);
                setUserWalletAddress(walletAddress);
                setTokenContract(tokenContract);
                setCrazyFacesContract(crazyFacesContract);
                setMintContract(mintContract);
    
                const decimals = await tokenContract.decimals();
                const tokenBalance = await tokenContract.balanceOf(walletAddress);
                const canMint = await tokenContract.checkIfUserCanMint(walletAddress);
                const formattedBalance = ethers.utils.formatUnits(tokenBalance, decimals);
                setDecimals(decimals);
                setTokenBalance(tokenBalance);
                setCanMint(canMint);
                setFormattedTokenBalance(formattedBalance);
                }
            }
            console.log('EthersContext initialized.... Ready for contract interactions....')
        };

        window.ethereum.on('chainChanged', (networkIdHex) => {
            const networkId = parseInt(networkIdHex, 16);
            ethersDataSetup(networkId);
        });
    
        // Initial setup
        ethersDataSetup(parseInt(window.ethereum.networkVersion, 10));
    }, []);

return (
        <EthersContext.Provider value={{
}}>
            {children}
        </EthersContext.Provider>
    )
}