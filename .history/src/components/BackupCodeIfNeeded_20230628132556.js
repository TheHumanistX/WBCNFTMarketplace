From SellNFT.js

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

