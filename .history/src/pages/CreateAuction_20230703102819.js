import React, { useContext, useEffect, useState } from 'react'
import { useAddress, useContract, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ShowOwnedNFTs } from '../components'
import { useOwnedNFTs } from '../hooks';
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const CreateAuction = () => {

    const {
        approveNFTTransfer,
        createListing,
        marketplaceContractAddress,
        marketplaceContract,
        marketplaceNFTListedEvents,
        nftContractAddress,
        nftContract,
        nftContractName,
        nftTransferEvents,
        setNFTContractAddress,
        tokenAddress,
        userNFTBalance,
        userWalletAddress,
        lastNFTMintedId,
    } = useContext(MarketplaceContext);

    const [saleCurrency, setListingCurrency] = useState('ETH');

    const { mutateAsync: createAuction } = useContractWrite(marketplaceContract, "createAuction")
    const { data: contractName } = useContractRead(nftContract, "name");
    const { mutateAsync: approve } = useContractWrite(nftContract, "approve")
    
    const ownedNFTs = useOwnedNFTs(lastNFTMintedId, nftContract, marketplaceContract, userWalletAddress);
    
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
    
    const handleSubmit = (e) => {
        e.preventDefault(); // prevent default form submission
        setNFTContractAddress(e.target.nftContractAddress.value);
    }

    const handleCreateAuction = async (e) => {
        e.preventDefault();
        let approval;
        const date = new Date();
        const tokenId = Number(e.target.tokenId.value);
        const initBid = e.target.initialBidAmount.value;
        const bidIncrement = e.target.bidIncrement.value;
        const beginTime = e.target.auctionBeginTime.value;
        const expiration = e.target.auctionEndTime.value;
        
        // Create a new Date object from the date and time strings
        const beginDateTime = new Date(`${date.toDateString()} ${beginTime}`);
        const expirationDateTime = new Date(`${date.toDateString()} ${expiration}`);
        
        // Convert the Date objects to UNIX timestamps in seconds
        const beginTimestamp = Math.round(beginDateTime.getTime() / 1000);
        const expirationTimestamp = Math.round(expirationDateTime.getTime() / 1000);
        
        const initBidInWei = ethers.utils.parseEther(initBid);
        const bidIncrementInWei = ethers.utils.parseEther(bidIncrement);

        approval = await handleApprove(marketplaceContractAddress, tokenId);
        if (saleCurrency == 'ETH') {
          
          if (approval && approval.receipt.status === 1) {
            try {
              const data = await createAuction({ args: [nftContractAddress, tokenId, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp] });
              console.info("contract call successs", data);
            } catch (err) {
              console.error("contract call failure", err);
            }
          }

        } else {
          
        //   approval = await handleApprove(marketplaceContractAddress, tokenId);
          
          if (approval && approval.receipt.status === 1) {
            try {
              const data = await createAuction({ args: [nftContractAddress, tokenAddress, tokenId, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp] });
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
            { nftContract &&  
            <>
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
                        tokenId={tokenId}
                        onListingSubmission={handleCreateAuction}
                        setListingCurrency={setListingCurrency}
                    />)

                }
                )}
                 </div>
                </>
            }
            
           
        </section>
    )
}

export default CreateAuction
