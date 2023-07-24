From SellNFT.js

Pre - Context Stuffs:

// const [nftContractAddress, setNFTContractAddress] = useState('');
// const [ownedNFTs, setOwnedNFTs] = useState([])
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

Other:

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

From BuyNFT.js:

// Ethers setup if thirdweb useContractEvents messes up
 // useEffect(() => {
  //   const fetchEvents = async () => {
  //     if (!marketplaceContract) {
  //       return;
  //     }
  //     const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
  //     const contract = new ethers.Contract(marketplaceContractAddress, marketplaceABI, provider);
  //     const filter = contract.filters.ListingCreated();
  //     await provider.send("eth_requestAccounts", [])

  //     const logs = await provider.getLogs({
  //       fromBlock: 9244156,
  //       toBlock: "latest",
  //       address: contract.address,
  //       topics: filter.topics,
  //     });
  //     const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
  //     // console.log('parsed logs: ', parsedLogs ? parsedLogs : '');
  //     const currentListings = parsedLogs.map((log) => ({
  //       listingID: log.args.listingID.toNumber(),
  //       nftContractAddress: log.args.nftContract,
  //       owner: log.args.owner,
  //       price: log.args.price,
  //       tokenContractAddress: log.args.paymentContract,
  //       tokenID: log.args.tokenID.toNumber()
  //     }));
  //     setLiveListings(currentListings);
  //     // const currentListings = parsedLogs ? parsedLogs.map((log) => ({[log.args.listingID.toNumber()] : log.args.tokenID.toNumber()})) : '';
  //     // setLiveListings(currentListings.slice(0, 5));

  //   };

  //   fetchEvents();
  // }, [marketplaceABI, marketplaceContract]);