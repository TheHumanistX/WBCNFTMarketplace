import React, { useState, useEffect } from 'react'
import { useAddress, useContract, useContractRead, useNFTBalance } from '@thirdweb-dev/react'

const SellNFT = () => {

  const [contractAddress, setContractAddress] = useState('');
  const handleSubmit = (e) => {
    setContractAddress(e.data.contractAddress);
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
  const { data: walletAddress } = useAddress();
  const { data: userNFTBalance } = useNFTBalance(contract, "0x59d2366B5961a5686Af406A83Cf90615B4229f78");
  console.log("userNFTBalance", userNFTBalance ? userNFTBalance.toNumber() : '')
   
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
