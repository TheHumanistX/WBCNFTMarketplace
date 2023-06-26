import React, { useState, useEffect } from 'react'
import { useAddress, useContract, useContractRead, useNFTBalance } from '@thirdweb-dev/react'

const SellNFT = () => {

  const [contractAddress, setContractAddress] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setContractAddress(e.target.contractAddress.value);
  }

  useEffect(() => {
    
  }, [contractAddress]);
  const { contract } = useContract(contractAddress);
  console.log("contract", contract);
  const walletAddress = useAddress();
  const { data: userNFTBalance } = useNFTBalance(contract, walletAddress);
  console.log("userNFTBalance", userNFTBalance ? userNFTBalance.toNumber() : '')
  const { data: contractName } =useContractRead(contract, "name");
  console.log('contractName', contractName ? contractName : '');
   
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
