import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS, ETH_NULL_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from "../constants";
import { crazyfacesABI, marketplaceABI, tokenABI } from '../ABI';

const EthersContext = createContext();

export const EthersProvider = ({ children }) => {

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userWalletAddress, setUserWalletAddress] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [marketplaceContract, setMarketplaceContract] = useState(null);
    const [chainName, setChainName] = useState(null);
    const [network, setNetwork] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);
    const [formattedTokenBalance, setFormattedTokenBalance] = useState(null);
    const [decimals, setDecimals] = useState(null);
    const [canMint, setCanMint] = useState(false);
    const [nftContractAddress, setNFTContractAddress] = useState('');
    const [nftContract, setNFTContract] = useState(null);
    const [userNFTBalance, setUserNFTBalance] = useState(null);
    const [lastNFTMintedId, setLastNFTMintedId] = useState(null);
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
                    const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceABI, signer);
                    setSigner(signer);
                    setUserWalletAddress(walletAddress);
                    setTokenContract(tokenContract);
                    setMarketplaceContract(marketplaceContract);


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

    useEffect(() => {
        const fetchNFTContractData = async () => {

            const nftContract = new ethers.Contract(nftContractAddress, crazyfacesABI, signer);
            const nftBalance = await nftContract.balanceOf(userWalletAddress);
            let lastNFTMintedId = await nftContract.getLastTokenID();
            lastNFTMintedId = lastNFTMintedId ? lastNFTMintedId.toNumber() - 1 : null;
            setNFTContract(nftContract);
            setUserNFTBalance(nftBalance);
            setLastNFTMintedId(lastNFTMintedId);
        }
    }, [nftContractAddress]);

    return (
        <EthersContext.Provider value={{
        }}>
            {children}
        </EthersContext.Provider>
    )
}