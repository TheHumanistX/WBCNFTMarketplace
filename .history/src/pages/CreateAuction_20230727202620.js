import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAddress, useContract, useContractRead, useContractWrite, useNFTBalance } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { MarketplaceContext } from '../context/MarketplaceContext';
import { useMarketplace, useNFT, useToken } from '../context';
import { AlertModal, AuctionSalesManagementButton, ShowOwnedNFTs } from '../components'
import { useCheckAuctionCollectSalesCancel, useOwnedNFTs } from '../hooks';
import { approveNFTTransfer, createAuctionInputChecks, createNewAuction } from '../utility';

const CreateAuction = () => {
    const location = useLocation();
    const path = location.pathname;

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
    const [listingCurrency, setListingCurrency] = useState('ETH');
    const [txConfirm, setTxConfirm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [ createAuctionCheckFailed, setCreateAuctionCheckFailed] = useState(false);
    const [displayButton, setDisplayButton] = useState(false);

    console.log('lastNFTMintedId: ', lastNFTMintedId);
    const ownedNFTs = useOwnedNFTs(txConfirm);

    const handleSubmit = (e) => {
        e.preventDefault(); // prevent default form submission
        setNFTContractAddress(e.target.nftContractAddress.value);
    }

    const handleCreateAuction = async (auctionDetails) => {
        console.log('handleCreateAuction initBid: ', auctionDetails.initialBidAmount);
        if(!await createAuctionInputChecks(auctionDetails, setIsOpen, setModalText)) return;
     
        let approval;
        
        const tokenId = Number(auctionDetails.tokenId);
        const initBid = auctionDetails.initialBidAmount;
        const bidIncrement = auctionDetails.bidIncrement;
        const beginTime = new Date(auctionDetails.auctionBeginTime);
        const expirationTime = new Date(auctionDetails.auctionEndTime);

        // Convert the Date objects to UNIX timestamps in seconds
        const beginTimestamp = Math.round(beginTime.getTime() / 1000);
        const expirationTimestamp = Math.round(expirationTime.getTime() / 1000);
        const initBidInWei = ethers.utils.parseEther(initBid);
        const bidIncrementInWei = ethers.utils.parseEther(bidIncrement);

        try {
            approval = await approveNFTTransfer(nftContract, marketplaceContractAddress, tokenId);
        } catch (err) {
            console.error("Error during nft list approval:", err);
            setIsOpen(true);
            setModalText(`Failed to approve NFT transfer: ${err.message}`);
            return;
        }

        try {
            await createNewAuction(
                listingCurrency,
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
            {displayButton && <AuctionSalesManagementButton setDisplayButton={setDisplayButton} />}
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

            <AlertModal open={isOpen} onClose={() => setIsOpen(false)}>
                {modalText}
            </AlertModal>
        </section>
    )
}

export default CreateAuction
