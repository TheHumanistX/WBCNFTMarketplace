import React, { useState, useEffect } from 'react'
import { useAddress, useContract, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { ShowOwnedNFTs } from './'
import crazyfacesABI from '../ABI/crazyfacesABI.json'
import marketplaceABI from '../ABI/marketplaceABI.json'

const SellNFT = () => {

  const [nftContractAddress, setNFTContractAddress] = useState('');
  const [transactions, setTransactions] = useState([])
  const [ownedNFTs, setOwnedNFTs] = useState([])
  const [listedNFTs, setListedNFTs] = useState([])
  const [saleCurrency, setSaleCurrency] = useState('ETH');



  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setNFTContractAddress(e.target.nftContractAddress.value);
  }
  const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  const tokenAddress = '0xFB29697113015019c42E90fdBC94d9B4898D2602';
  // const crazyFacesContractAddress = '0xf94a9747C20076D56F84320aCF36431dAE557Fb7';
  // const { contract: crazyFacesContract } = useContract(crazyFacesContractAddress);
  // console.log("contract", crazyFacesContract);
  // const { data: userNFTBalance } = useNFTBalance(crazyFacesContract, "0x59d2366B5961a5686Af406A83Cf90615B4229f78");
  // console.log("userNFTBalance", userNFTBalance ? userNFTBalance.toNumber() : '')
  // const { data: contractName } =useContractRead(crazyFacesContract, "name");
  // console.log('contractName', contractName ? contractName : '')

  const { nftContract } = useContract(nftContractAddress);
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  const walletAddress = useAddress();
  const { data: userNFTBalance } = useNFTBalance(nftContract, walletAddress);
  const { data: contractName } = useContractRead(nftContract, "name");
  const { mutateAsync: approve } = useContractWrite(nftContract, "approve")
  const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")


  useEffect(() => {

    if (!nftContractAddress) {
      return; // if there's no contract address, exit early
    }

    const fetchEvents = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
      const nftContract = nftContractAddress ? new ethers.Contract(nftContractAddress, crazyfacesABI, provider) : '';
      const marketplaceContract = marketplaceContractAddress ? new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider) : '';
      const transferFilter = nftContract ? nftContract.filters.Transfer() : ''; // assumes your contract has a Transfer event
      const listedFilter = marketplaceContract ? marketplaceContract.filters.ListingCreated() : '';
      await provider.send("eth_requestAccounts", [])

      const nftLogs = await provider.getLogs({
        fromBlock: 9168594,
        toBlock: "latest",
        address: nftContract.address,
        topics: transferFilter.topics,
      });
      const listedLogs = await provider.getLogs({
        fromBlock: 9168594,
        toBlock: "latest",
        address: marketplaceContract.address,
        topics: listedFilter.topics,
      });
      const parsedNFTLogs = nftLogs.map((log) => nftContract.interface.parseLog(log));
      const tokenIdsOwnedByWallet = parsedNFTLogs ? parsedNFTLogs.map((log) => {
        if (log.args.to.toLowerCase() === walletAddress.toLowerCase()) {
          return (log.args.tokenId.toNumber())
        }
      }) : '';
      const parsedListedLogs = listedLogs.map((log) => marketplaceContract.interface.parseLog(log));
      const tokenIdsListedForSale = parsedListedLogs ? parsedListedLogs.map((log) => {
        if (log.args.owner.toLowerCase() === walletAddress.toLowerCase()) {
          return (log.args.tokenID.toNumber())
        }
      }) : '';
      setOwnedNFTs(tokenIdsOwnedByWallet.filter(tokenId => tokenId !== null && tokenId !== undefined));
      setListedNFTs(tokenIdsListedForSale.filter(tokenId => tokenId !== null && tokenId !== undefined));
    };

    fetchEvents();
  }, [crazyfacesABI, nftContractAddress]);

  const handleApprove = async (marketplaceContractAddress, tokenId) => {
    console.log('handleApprove tokenId: ', tokenId)
    let approval;
    try {
      approval = await approve({ args: [marketplaceContractAddress, tokenId] });
      console.info("contract call successs", approval);
      return approval;
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const handleListNFTForSale = async (e) => {
    e.preventDefault();
    let approval;
    const price = e.target.price.value;
    const tokenId = Number(e.target.tokenId.value);
    if (saleCurrency == 'ETH') {
      // conver price to wei
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      
      console.log('Selling for ', price, ' ', saleCurrency)
      console.log('Selling price in wei: ', priceInWei)
      if (approval && approval.receipt.status === 1) {
        try {
          const data = await createListing({ args: [nftContractAddress, tokenId, priceInWei] });
          console.info("contract call successs", data);
        } catch (err) {
          console.error("contract call failure", err);
        }
      }
      
    } else {
      const price = e.target.price.value;
      approval = await handleApprove(marketplaceContractAddress, tokenId);
      const priceInWei = ethers.utils.parseEther(price);
      console.log('Selling for ', price, ' ', saleCurrency)
      console.log('Selling price in wei: ', priceInWei)
      if (approval && approval.receipt.status === 1) {
        try {
          const data = await createListing({ args: [nftContractAddress, tokenAddress, tokenId, priceInWei] });
          console.info("contract call successs", data);
        } catch (err) {
          console.error("contract call failure", err);
        }
      }
    }



  }

  return (
    <section className='sellNFT__container'>
      <h1>LIST YOUR NFT</h1>
      <form onSubmit={handleSubmit} className='sellNFT__contract-form'>
        <label htmlFor='nftContractAddress'>CONTRACT ADDRESS</label>
        <input type='text' id='nftContractAddress' placeholder='Contract Address' />
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
        {
        ownedNFTs && 
        
        ownedNFTs.filter((ownedNft) => !listedNFTs.includes(ownedNft)).map((tokenId, index) => {

          return (
            <div key={index}>
          <ShowOwnedNFTs
            nftContractAddress={nftContractAddress}
            nftContract={nftContract}
            nftId={tokenId}
            handleListNFTForSale={handleListNFTForSale}
            setSaleCurrency={setSaleCurrency}
          />
          <form onSubmit={handleListNFTForSale} className='owned-nft__sale-form'>
                        <label htmlFor='currency'>Currency: </label>
                        <select
                            id='currency'
                            name='currency'
                            onChange={e => setSaleCurrency(e.target.value)}
                        >
                            <option value='ETH'>ETH</option>
                            <option value='WBC'>WBC</option>
                        </select>
                        <label htmlFor='price'>Price: </label>
                        <input type='text' id='price' name='price' placeholder='Price' />
                        <input type='hidden' id='tokenId' name='tokenId' value={tokenId} />
                        <input type='submit' value='List For Sale' />
                    </form>
                    </div>
          )

        }
        )}
      </div>
    </section>
  )
}

export default SellNFT
