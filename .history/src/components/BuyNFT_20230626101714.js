import React from 'react'
import { ethers } from 'ethers'
import { useContract, useContractEvents } from '@thirdweb-dev/react'
import ABI from '../ABI/ABI.json'

const BuyNFT = () => {

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [address, setAddress] = useState(null);
  const marketplaceContractAddress = '0x087a491807bF4B66Ab0Bb3609E628816D463f87E';
  const { contract: marketplaceContract } = useContract(marketplaceContractAddress);
  console.log("contract", marketplaceContract);
  const { data } = useContractEvents(marketplaceContract, "ListingCreated");
  console.log("NFT Listings: ", data)

  useEffect(() => {
    const fetchEvents = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // or whatever provider you're using
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const filter = contract.filters.Transfer(); // assumes your contract has a Transfer event
      await provider.send("eth_requestAccounts", [])

      const signer = provider.getSigner()

      const signerAddress = await signer.getAddress()
      setAddress(signerAddress)

      const logs = await provider.getLogs({
        fromBlock: 17552335,
        toBlock: "latest",
        address: contract.address,
        topics: filter.topics,
      });
      const parsedLogs = logs.map((log) => contract.interface.parseLog(log));
      const transactions = parsedLogs ? parsedLogs.map((log) => log.args.to) : '';
      setRecentTransactions(transactions.slice(0, 5));
    };

    fetchEvents();
  }, [abi, contractAddress]);


  return (
    <section>

    </section>
  )
}

export default BuyNFT
