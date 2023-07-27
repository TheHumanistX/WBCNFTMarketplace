import React, { useState, useEffect } from 'react'
import { useAddress, useContract, useContractRead, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { ShowOwnedNFTs } from './'
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const SellNFT = () => {

  const [contractAddress, setContractAddress] = useState('');
  const [transactions, setTransactions] = useState([])
  const [ownedNFTs, setOwnedNFTs] = useState([])
  const [saleCurrency, setSaleCurrency] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setContractAddress(e.target.contractAddress.value);
  }
  // const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  // const crazyFacesContractAddress = '0xf94a9747C20076D56F84320aCF36431dAE557Fb7';
  // const { contract: crazyFacesContract } = useContract(crazyFacesContractAddress);
  // console.log("contract", crazyFacesContract);
  // const { data: userNFTBalance } = useNFTBalance(crazyFacesContract, "0x59d2366B5961a5686Af406A83Cf90615B4229f78");
  // console.log("userNFTBalance", userNFTBalance ? userNFTBalance.toNumber() : '')
  // const { data: contractName } =useContractRead(crazyFacesContract, "name");
  // console.log('contractName', contractName ? contractName : '')

  const { contract } = useContract(contractAddress);
  const walletAddress = useAddress();
  const { data: userNFTBalance } = useNFTBalance(contract, walletAddress);
  const { data: contractName } = useContractRead(contract, "name");


  useEffect(() => {

    if (!contractAddress) {
      return; // if there's no contract address, exit early
    }

    const fetchEvents = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
      const contract = contractAddress ? new ethers.Contract(contractAddress, crazyfacesABI, provider) : '';
      const filter = contract ? contract.filters.Transfer() : ''; // assumes your contract has a Transfer event
      await provider.send("eth_requestAccounts", [])

      const logs = await provider.getLogs({
        fromBlock: 9168594,
        toBlock: "latest",
        address: contract.address,
        topics: filter.topics,
      });
      const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
      const tokenIdsOwnedByWallet = parsedLogs ? parsedLogs.map((log) => {
        if (log.args.to.toLowerCase() === walletAddress.toLowerCase()) {
          return (log.args.tokenId.toNumber())
        }
      }) : '';
      setOwnedNFTs(tokenIdsOwnedByWallet.filter(tokenId => tokenId !== null && tokenId !== undefined));
      // setRecentTransactions(transactions.slice(0, 5));
    };

    fetchEvents();
  }, [crazyfacesABI, contractAddress]);
 

  const handleListNFTForSale = async (e) => {
    e.preventDefault();
    if (saleCurrency == 'ETH') {
      const price = e.target.price.value;
      console.log('Selling for ', price, ' ', saleCurrency)
    } else {
      const price = e.target.price.value;
      console.log('Selling for ', price, ' ', saleCurrency)
    }

    

  }

  return (
    <section className='sellNFT__container'>
      <h1>LIST YOUR NFT</h1>
      <form onSubmit={handleSubmit} className='sellNFT__contract-form'>
        <label>CONTRACT ADDRESS</label>
        <input type='text' id='contractAddress' placeholder='Contract Address' />
        <input type='submit' value='Submit' />
      </form>
      <span>You currently hold {userNFTBalance ? userNFTBalance.toNumber() : '0'} NFTs from the {contractName ? contractName : ''} contract.</span>
      <span>IDs of currently held nfts are: {
        ownedNFTs &&
        ownedNFTs.map((tokenId, index) => {
          if (index === ownedNFTs.length - 1) {
            return (
              <span key={index}>{tokenId}</span>
            )
          }
          return (
            <span key={index}>{tokenId}, </span>
          )
        })
      }</span>
      <div className='sellnft__owned-grid'>
        {ownedNFTs && ownedNFTs.map((tokenId) => {
          
          return (<ShowOwnedNFTs 
            contractAddress={contractAddress} 
            contract={contract} 
            nftId={tokenId} 
            handleListNFTForSale={handleListNFTForSale} 
            setSaleCurrency={setSaleCurrency} 
          />)

        }
        )}
      </div>
    </section>
  )
}

export default SellNFT
