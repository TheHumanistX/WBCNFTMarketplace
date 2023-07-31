import React from 'react';
import ShowOwnedNFTs from './ShowOwnedNFTs';

const OwnedNFTs = ({ nftContract, userNFTBalance, nftContractName, ownedNFTs, handleCreateAuction, setListingCurrency }) => {
    if (!nftContract) return null;

    return (
        <>
            <span>You currently hold {userNFTBalance ? userNFTBalance.toNumber() : '0'} NFTs from the {nftContractName ? nftContractName : ''} contract.</span>
            {!ownedNFTs ? (
                <p>Loading owned NFTs...</p>
            ) : (
                <div className='auctionnft__owned-grid'>
                    {ownedNFTs.map((tokenId, index) => (
                        <ShowOwnedNFTs
                            tokenId={tokenId}
                            onListingSubmission={handleCreateAuction}
                            setListingCurrency={setListingCurrency}
                            key={index}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default OwnedNFTs;
