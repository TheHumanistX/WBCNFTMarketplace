import React, { useState, useEffect } from 'react'
import { useAddress, useContract, useContractRead, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const SellNFT = () => {

  const [contractAddress, setContractAddress] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactions, setTransactions] = useState([])
  const [ownedNFTs, setOwnedNFTs] = useState([])
  

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
  console.log("contract", contract);
  const walletAddress = useAddress();
  const { data: userNFTBalance } = useNFTBalance(contract, walletAddress);
  console.log("userNFTBalance", userNFTBalance ? userNFTBalance.toNumber() : '')
  const { data: contractName } =useContractRead(contract, "name");
  console.log('contractName', contractName ? contractName : '');

  useEffect(() => {
    const fetchEvents = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
      const contract = contractAddress ? new ethers.Contract(contractAddress, crazyfacesABI, provider) : '';
      const filter = contract ? contract.filters.Transfer() : ''; // assumes your contract has a Transfer event
      await provider.send("eth_requestAccounts", [])

      const logs = await provider.getLogs({
        fromBlock: 17552335,
        toBlock: "latest",
        address: contract.address,
        topics: filter.topics,
      });
      const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
      const transactions = parsedLogs ? parsedLogs.map((log) => log.args.to) : '';
      setTransactions(transactions);
      // console.log('transactions', transactions)
      for (let i = 0; i < transactions.length; i++) {
        const element = transactions[i];
        if (element.to === walletAddress) {
          console.log('element', element)
          ownedNFTs.push(element.tokenId)
        }
      setRecentTransactions(transactions.slice(0, 5));
    };
 
    fetchEvents();
  }, [crazyfacesABI, contractAddress]);

  useEffect(() => {
    console.log('transactions', transactions)
  }, [transactions])
  return (
    <section className='sellNFT__container'>
      <h1>LIST YOUR NFT</h1>
      <form onSubmit={handleSubmit}>
      <input type='text' id='contractAddress' placeholder='Contract Address' />
      <input type='submit' value='Submit' />
      </form>
      <span>You currently hold { userNFTBalance ? userNFTBalance.toNumber() : '0' } NFTs from the { contractName ? contractName : '' } contract.</span>
    </section>
  )
}

export default SellNFT
