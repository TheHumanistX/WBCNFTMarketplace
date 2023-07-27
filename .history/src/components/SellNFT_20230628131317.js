import React, { useState, useContext, useEffect } from 'react'
import { useAddress, useContract, useContractEvents, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { ShowOwnedNFTs } from './'
import { MarketplaceContext } from '../context/MarketplaceContext'
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const SellNFT = () => {
  const { approveNFTTransfer, createListing, marketplaceContractAddress, marketplaceContract, marketplaceNFTListedEvents, nftContractAddress, nftContract, nftContractName, nftTransferEvents, setNFTContractAddress, ownedNFTs, setOwnedNFTs, userNFTBalance, userWalletAddress } = useContext(MarketplaceContext);
  // const [nftContractAddress, setNFTContractAddress] = useState('');
  const [transactions, setTransactions] = useState([])
  // const [ownedNFTs, setOwnedNFTs] = useState([])
  const [saleCurrency, setSaleCurrency] = useState('ETH');



  const handleSubmit = (e) => {
    e.preventDefault(); // prevent default form submission
    setNFTContractAddress(e.target.nftContractAddress.value);
  }
  // const marketplaceContractAddress = '0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA';
  // const tokenAddress = '0xFB29697113015019c42E90fdBC94d9B4898D2602';
  // const crazyFacesContractAddress = '0xf94a9747C20076D56F84320aCF36431dAE557Fb7';
  // const { contract: crazyFacesContract } = useContract(crazyFacesContractAddress);
  // console.log("contract", crazyFacesContract);
  // const { data: userNFTBalance } = useNFTBalance(crazyFacesContract, "0x59d2366B5961a5686Af406A83Cf90615B4229f78");
  // console.log("userNFTBalance", userNFTBalance ? userNFTBalance.toNumber() : '')
  // const { data: nftContractName } =useContractRead(crazyFacesContract, "name");
  // console.log('nftContractName', nftContractName ? nftContractName : '')

  // const { contract: nftContract } = useContract(nftContractAddress);
  // const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  // const userWalletAddress = useAddress();
  // const { data: userNFTBalance } = useNFTBalance(nftContract, userWalletAddress);
  // const { data: nftContractName } = useContractRead(nftContract, "name");
  // const { mutateAsync: approveNFTTransfer } = useContractWrite(nftContract, "approve")
  // const { mutateAsync: createListing } = useContractWrite(marketplaceContract, "createListing")
  // const { data: nftTransferEvents } = useContractEvents(nftContract, "Transfer", {
  //   queryFilter: {
  //     order: "asc",
  //   },
  //   subscribe: true
  // });
  // const { data: marketplaceNFTListedEvents } = useContractEvents(marketplaceContract, "ListingCreated", {
  //   queryFilter: {
  //     order: "asc",
  //   },
  //   subscribe: true
  // });
  console.log('nftTransferEvents', nftTransferEvents ? nftTransferEvents[0].data.tokenId.toNumber() : '');
  console.log('nftTransferEvents type: ', typeof (nftTransferEvents))
  console.log('listingCreated: ', marketplaceNFTListedEvents ? marketplaceNFTListedEvents[0].data.tokenID.toNumber() : '');


  useEffect(() => {

    if (!nftTransferEvents || !marketplaceNFTListedEvents) {
      return; // if there's no contract address, exit early
    }

    const fetchEvents = async () => {

      console.log('Entered fetchEvents....')
      let tokenIdsOwnedByWallet = Object.values(nftTransferEvents)
        .filter(event => event.data.to.toLowerCase() === userWalletAddress.toLowerCase())
        .map(event => event.data.tokenId.toNumber());
      let tokenIdsForCreatedListings = Object.values(marketplaceNFTListedEvents)
        .filter(event => event.data.owner.toLowerCase() === userWalletAddress.toLowerCase())
        .map(event => event.data.tokenID.toNumber());
      console.log('tokenIdsForCreatedListings: ', tokenIdsForCreatedListings);
      // remove any tokenId from tokenIdsOwnedByWallet that is also in tokenIdsForCreatedListings
      tokenIdsOwnedByWallet = tokenIdsOwnedByWallet.filter(tokenId => !tokenIdsForCreatedListings.includes(tokenId));
      // This line converts the tokenIdsOwnedByWallet into a Set. Sets only allow unique values, so this gets rid of the 
      // potential for any duplicate values. Then, by wrapping it in [ ], we convert it BACK to an array.
      tokenIdsOwnedByWallet = [...new Set(tokenIdsOwnedByWallet)];
      setOwnedNFTs(tokenIdsOwnedByWallet);

    };

    fetchEvents();
  }, [nftContract, nftTransferEvents, marketplaceNFTListedEvents]);

  // Leaving this entire useEffect snippet for now as it was how I gathered events and pulled tokenIds while 
  // ThirdWeb's event hook wasn't working properly... so... JUST IN CASE, I am keeping it in here
  // useEffect(() => {

  //   if (!nftContractAddress) {
  //     return; // if there's no contract address, exit early
  //   }

  //   const fetchEvents = async () => {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
  //     const contract = nftContractAddress ? new ethers.Contract(nftContractAddress, crazyfacesABI, provider) : '';
  //     const filter = contract ? contract.filters.Transfer() : ''; // assumes your contract has a Transfer event
  //     await provider.send("eth_requestAccounts", [])

  //     const logs = await provider.getLogs({
  //       fromBlock: 9168594,
  //       toBlock: "latest",
  //       address: contract.address,
  //       topics: filter.topics,
  //     });
  //     const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
  //     const tokenIdsOwnedByWallet = parsedLogs ? parsedLogs.map((log) => {
  //       if (log.args.to.toLowerCase() === userWalletAddress.toLowerCase()) {
  //         return (log.args.tokenId.toNumber())
  //       }
  //     }) : '';
  //     setOwnedNFTs(tokenIdsOwnedByWallet.filter(tokenId => tokenId !== null && tokenId !== undefined));

  //   };

  //   fetchEvents();
  // }, [crazyfacesABI, nftContractAddress]);

  // END SAVED SNIPPET

  const handleApprove = async (marketplaceContractAddress, tokenId) => {
    console.log('handleApprove tokenId: ', tokenId)
    let approval;
    try {
      approval = await approveNFTTransfer({ args: [marketplaceContractAddress, tokenId] });
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
        <label>CONTRACT ADDRESS</label>
        <input type='text' id='nftContractAddress' placeholder='Contract Address' />
        <input type='submit' value='Submit' />
      </form>
      <span>You currently hold {userNFTBalance ? userNFTBalance.toNumber() : '0'} NFTs from the {nftContractName ? nftContractName : ''} contract.</span>
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
            nftContractAddress={nftContractAddress}
            nftContract={nftContract}
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
