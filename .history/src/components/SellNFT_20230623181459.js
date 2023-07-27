import React from 'react'
import { useContract, useNFTBalance } from '@thirdweb-dev/react'

const SellNFT = () => {

  // const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  const crazyFacesContractAddress = '0xf94a9747C20076D56F84320aCF36431dAE557Fb7';
  const { contract: crazyFacesContract } = useContract(crazyFacesContractAddress);
  console.log("contract", crazyFacesContract);
  const { data } = useNFTBalance(crazyFacesContract, "0x59d2366B5961a5686Af406A83Cf90615B4229f78");
  console.log("data", toNumber(data))
  return (
    <section>
      
    </section>
  )
}

export default SellNFT
