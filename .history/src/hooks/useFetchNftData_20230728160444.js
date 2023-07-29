import { useState, useEffect } from "react";

export const useFetchNftData = (nftContract, tokenId) => {
  const [nftData, setNftData] = useState(null);
  const [nft, setNFT] = useState(null);

  useEffect(() => {
    if (!nftContract || tokenId === null || tokenId === undefined) return;
    const fetchURI = async () => {
      const nft = await nftContract.tokenURI(tokenId >= 0 ? tokenId : 0);
      console.log('nft: ', nft);
      setNFT(nft);
    }
    fetchURI();
  }, [nftContract, tokenId]);

  useEffect(() => {
    const ipfsUrl = (ipfsUrl) => {
      if (!ipfsUrl) return '';
      // Convert the ipfs URL to a HTTP URL
      return `https://ipfs.io/ipfs/${ipfsUrl.split('ipfs://')[1]}`;
    };

    const fetchNftData = async () => {
      if (!nft || tokenId === null || tokenId === undefined) return;
      const url = ipfsUrl(nft);
      try {
        const response = await fetch(url);
        const json = await response.json();
        setNftData(json);
      } catch (error) {
        console.error('Failed to fetch NFT data:', error);
      }
    };

    fetchNftData();
  }, [nft, tokenId]);

  return nftData;
};
