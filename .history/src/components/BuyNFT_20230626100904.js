import React from 'react'
import { useContract, useContractEvents } from '@thirdweb-dev/react'

const BuyNFT = () => {
  
  const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  console.log("contract", marketplaceContract);
  const { data } = useContractEvents(marketplaceContract, "NFTListed";
  

  return (
    <section>
      
    </section>
  )
}

export default BuyNFT
