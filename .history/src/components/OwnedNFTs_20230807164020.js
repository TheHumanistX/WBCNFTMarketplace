import React from 'react';
import ShowOwnedNFTs from './ShowOwnedNFTs';

const OwnedNFTs = ({ 
  ownedNFTs, 
  handleListingSubmission, 
  setListingCurrency, 
  nftContractName,
  showCurrencySelector = true
}) => {
  return (
    <>
      <span>You currently hold {ownedNFTs ? ownedNFTs.length : '0'} {ownedNFTs.length === 1 ? 'NFT' : 'NFTs' } from the {nftContractName ? nftContractName : ''} contract.</span>
      <div className='ownednft__owned-grid'>
        {!ownedNFTs ? (
          <p>Loading owned NFTs...</p>
        ) : (
          ownedNFTs.map((tokenId) => (
            <ShowOwnedNFTs
              tokenId={tokenId}
              onListingSubmission={handleListingSubmission}
              setListingCurrency={showCurrencySelector ? setListingCurrency : undefined}
            />
          ))
        )}
      </div>
    </>
  );
};

export default OwnedNFTs;
