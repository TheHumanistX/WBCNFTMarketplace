import React, { useContext, useEffect, useState } from 'react'
import { useAddress, useContract, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { useEthers, useMarketplace, useNFT, useToken } from '../context';
import { ShowOwnedNFTs } from '../components'
import { useOwnedNFTs } from '../hooks';
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const CreateAuction = () => {

    const {  //! Need to figure out if I need any of these or if I can just delete
        approveNFTTransfer,
        createListing,
        marketplaceNFTListedEvents,
        nftContractName,
        nftTransferEvents,
    } = useContext(MarketplaceContext);

    const { userWalletAddress } = useEthers();

    const {
        marketplaceContractAddress,
        marketplaceContract,
    } = useMarketplace();

    const {
        nftContractAddress,
        nftContract,
        nftContractName
        setNFTContractAddress,
        userNFTBalance,
        lastNFTMintedId,
    } = useNFT();

    const { tokenContractAddress } = useToken();

    const [saleCurrency, setListingCurrency] = useState('ETH');
    const [txConfirm, setTxConfirm] = useState('');

    const { mutateAsync: createAuction } = useContractWrite(marketplaceContract, "createAuction")
    const { data: contractName } = useContractRead(nftContract, "name");
    const { mutateAsync: approve } = useContractWrite(nftContract, "approve")

    console.log('lastNFTMintedId: ', lastNFTMintedId);
    const ownedNFTs = useOwnedNFTs(lastNFTMintedId, nftContract, marketplaceContract, userWalletAddress, txConfirm);

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

    const handleCreateAuction = async (auctionDetails) => {

        let approval;
        const date = new Date();
        const tokenId = Number(auctionDetails.tokenId);
        const initBid = auctionDetails.initialBidAmount;
        const bidIncrement = auctionDetails.bidIncrement;
        const beginTime = auctionDetails.auctionBeginTime;
        const expiration = auctionDetails.auctionEndTime;



        // Create a new Date object from the date and time strings
        const beginDateTime = new Date(beginTime);
        const expirationDateTime = new Date(expiration);

        // Convert the Date objects to UNIX timestamps in seconds
        const beginTimestamp = Math.round(beginDateTime.getTime() / 1000);
        const expirationTimestamp = Math.round(expirationDateTime.getTime() / 1000);
        console.log('initBid: ', initBid);
        console.log('typeof initBid: ', typeof (initBid));
        console.log('bidIncrement: ', bidIncrement);
        console.log('typeof bidIncrement: ', typeof (bidIncrement));
        const initBidInWei = ethers.utils.parseEther(initBid);
        const bidIncrementInWei = ethers.utils.parseEther(bidIncrement);

        approval = await handleApprove(marketplaceContractAddress, tokenId);
        if (saleCurrency == 'ETH') {

            if (approval && approval.receipt.status === 1) {
                try {
                    const transaction = await createAuction({ args: [nftContractAddress, tokenId, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp] });
                    console.info("contract call successs", transaction);
                    if (transaction.receipt.status === 1) {
                        console.info("contract call successs", transaction);
                        setTxConfirm(transaction.receipt.blockHash);
                    } else {
                        console.error("Transaction failed");
                    }
                } catch (err) {
                    console.error("contract call failure", err);
                }
            }

        } else {

            if (approval && approval.receipt.status === 1) {
                try {
                    const transaction = await createAuction({ args: [nftContractAddress, tokenId, tokenContractAddress, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp] });
                    console.info("contract call successs", transaction);
                    if (transaction.receipt.status === 1) {
                        console.info("contract call successs", transaction);
                        setTxConfirm(transaction.receipt.blockHash);
                    } else {
                        console.error("Transaction failed");
                    }
                } catch (err) {
                    console.error("contract call failure", err);
                }
            }
        }
    }
    // 
    return (
        <section className='auctionNFT__container'>
            <h1>LIST YOUR NFT</h1>
            <form onSubmit={handleSubmit} className='auctionNFT__contract-form'>
                <label>CONTRACT ADDRESS</label>
                <input type='text' id='nftContractAddress' placeholder='Contract Address' />
                <input type='submit' value='Submit' />
            </form>
            {nftContract &&
                <>
                    <span>You currently hold {userNFTBalance ? userNFTBalance.toNumber() : '0'} NFTs from the {contractName ? contractName : ''} contract.</span>
                    {!ownedNFTs ? (
                        <p>Loading owned NFTs...</p>
                    ) : (
                        <>
                            <span>IDs of currently held nfts are: {
                                ownedNFTs &&
                                ownedNFTs.map((tokenId, index) => {
                                    console.log('Entering map to list held NFT Ids at index ' + index + ' and token Id ' + tokenId + '...')
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
                            <div className='auctionnft__owned-grid'>
                                {ownedNFTs && ownedNFTs.map((tokenId, index) => {
                                    console.log('Entering map to display held nfts with token Id ' + tokenId + '...')
                                    return (<ShowOwnedNFTs
                                        tokenId={tokenId}
                                        onListingSubmission={handleCreateAuction}
                                        setListingCurrency={setListingCurrency}
                                        key={index}
                                    />)

                                }
                                )}
                            </div>
                        </>
                    )}
                </>
            }


        </section>
    )
}

export default CreateAuction
