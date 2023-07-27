import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAddress, useContract, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { useMarketplace, useNFT, useToken } from '../context';
import { ShowOwnedNFTs } from '../components'
import { useOwnedNFTs } from '../hooks';
import { approveNFTTransfer, createNewAuction } from '../utility';
import crazyfacesABI from '../ABI/crazyfacesABI.json'

const CreateAuction = () => {
    const location = useLocation();
    const path = location.pathname;

    const {  //! Need to figure out if I need any of these or if I can just delete
        approveNFTTransfer,
        createListing,
        marketplaceNFTListedEvents,
        nftTransferEvents,
    } = useContext(MarketplaceContext);
    // Import necessary context data for this component

    const {
        marketplaceContractAddress,
        marketplaceContract,
    } = useMarketplace();

    const {
        nftContractAddress,
        nftContract,
        nftContractName,
        setNFTContractAddress,
        userNFTBalance,
        lastNFTMintedId,
    } = useNFT();

    const { tokenContractAddress } = useToken();

    // Initialize state variables
    const [saleCurrency, setListingCurrency] = useState('ETH');
    const [txConfirm, setTxConfirm] = useState('');

    const { mutateAsync: createAuction } = useContractWrite(marketplaceContract, "createAuction")
    // const { mutateAsync: approve } = useContractWrite(nftContract, "approve")

    console.log('lastNFTMintedId: ', lastNFTMintedId);
    const ownedNFTs = useOwnedNFTs(txConfirm);

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

        try {
            approval = await approveNFTTransfer(nftContract, marketplaceContractAddress, tokenId);
        } catch (err) {
            console.error("Error during nft list approval:", err);
            return;
        }
        // if (saleCurrency == 'ETH') {

        //     if (approval && approval.status === 1) {
        //         try {
        //             const transactionResponse = await marketplaceContract.createAuction(nftContractAddress, tokenId, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp);
        //             const transactionReceipt = await transactionResponse.wait();
        //             console.info("contract call successs", transactionReceipt);
        //             if (transactionReceipt.status === 1) {
        //                 console.info("contract call successs", transactionReceipt);
        //                 setTxConfirm(transactionReceipt.blockHash);
        //             } else {
        //                 console.error("Transaction failed");
        //             }
        //         } catch (err) {
        //             console.error("contract call failure", err);
        //         }
        //     }

        // } else {

        //     if (approval && approval.receipt.status === 1) {
        //         try {
        //             const createListingSigWithToken = 'createListing(address,address,uint256,uint256)';
        //             const transactionResponse = await marketplaceContract.functions[createListingSigWithToken](nftContractAddress, tokenId, tokenContractAddress, initBidInWei, bidIncrementInWei, beginTimestamp, expirationTimestamp);
        //             const transactionReceipt = await transactionResponse.wait();
        //             console.info("contract call successs", transactionReceipt);
        //             if (transactionReceipt.status === 1) {
        //                 console.info("contract call successs", transactionReceipt);
        //                 setTxConfirm(transactionReceipt.blockHash);
        //             } else {
        //                 console.error("Transaction failed");
        //             }
        //         } catch (err) {
        //             console.error("contract call failure", err);
        //         }
        //     }
        // }

        try {
            const transaction = await createNewAuction(
                saleCurrency,
                approval,
                setTxConfirm,
                marketplaceContract,
                nftContractAddress,
                tokenId,
                tokenContractAddress,
                initBidInWei,
                bidIncrementInWei,
                beginTimestamp,
                expirationTimestamp
            )
        } catch (err) {
            console.error('Error during auction creation: ', err);
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
                    <span>You currently hold {userNFTBalance ? userNFTBalance.toNumber() : '0'} NFTs from the {nftContractName ? nftContractName : ''} contract.</span>
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
