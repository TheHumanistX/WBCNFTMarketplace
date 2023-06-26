import React from 'react'
import { useContract, useNFTBalance } from '@thirdweb-dev/react'

const SellNFT = () => {

  // const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  const { data: contract } = useContract(marketplaceContractAddress);
  const { data } = useNFTBalance(contract, "0x59d2366B5961a5686Af406A83Cf90615B4229f78");
  console.log("data", data)
  return (
    <section>
      
    </section>
  )
}

export default SellNFT
