import React, { useContext } from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const ListedSales = ({ 
    listingID,
    owner,
    nftPrice,
    tokenID,
    nftData,
    tokenSymbol,
    tokenContractAddress,
    nftContractName }) => {
    const {
        nftContract
    } = useContext(MarketplaceContext);
  return (
    <div>
      <span>Listing ID: {listingID + 1}</span>
                    <a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}><img src={`https://ipfs.io/ipfs/${nftData.image.split('ipfs://')[1]}`} alt={nftData.name} className='listed-nfts' /></a>
                    <span>{nftContractName} #{tokenID + 1}</span>
                    <span className='last-minted__name'><a href={`https://testnets.opensea.io/assets/goerli/${nftContract}/` + (tokenID)}>{nftData.name}</a></span>
                    <span>Price: {
                        tokenContractAddress === '0x0000000000000000000000000000000000000000'
                            ?
                            nftPrice + ' ETH'
                            :
                            nftPrice + ' ' + tokenSymbol

                    }</span>
                    <span>Sold By: {owner}</span>

    </div>
  )
}

export default ListedSales
