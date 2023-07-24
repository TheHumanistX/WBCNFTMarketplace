import React from 'react'

const ViewAuctions = () => {
  const {
    marketplaceContractAddress,
    marketplaceContract,
    marketplaceNFTListedEvents,
    tokenContract,
  } = useContext(MarketplaceContext);

  const [liveListings, setLiveListings] = useState([]);
  const [listingStatuses, setListingStatuses] = useState({});
  const { data: tokenSymbol } = useContractRead(tokenContract, 'symbol');
  const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  const { mutateAsync: buyNFT } = useContractWrite(marketplaceContract, "buyNFT")

  useEffect(() => {
    
    if (!marketplaceNFTListedEvents) {
      return;
    }
    console.log('marketplaceNFTListedEvents: ', marketplaceNFTListedEvents)
    const fetchEvents = async () => {

      console.log('Entered fetchEvents...');
     
      // Create the currentListings array as before
      const currentListings = marketplaceNFTListedEvents.map((event) => ({
        listingID: event.data.listingID.toNumber(),
        nftContractAddress: event.data.nftContract,
        owner: event.data.owner,
        price: event.data.price,
        formattedPrice: ethers.utils.formatEther(event.data.price),
        formattedPriceSymbol: event.data.paymentContract === '0x0000000000000000000000000000000000000000' ? 'ETH' : 'WBC',
        tokenContractAddress: event.data.paymentContract,
        tokenID: event.data.tokenID.toNumber(),
      }));
      
      console.log('currentListings: ', currentListings)
      // Fetch the status for each listing
      const listingStatuses = await Promise.all(
        currentListings.map((listing) =>
          marketplaceContract.call('getListingStatus', [listing.listingID])

        )
      );

      // Filter the current listings by status
      const activeListings = currentListings.filter(
        (listing, i) => listingStatuses[i] === 1
      );
  
      // Set the active listings in state
      setLiveListings(activeListings);
    };
  
    fetchEvents();
  }, [marketplaceContract, marketplaceNFTListedEvents]);
  

 

  const buyWithWBC = async (listingPrice, listingID) => {
    let approval;
    // console.log('buyWithWBC listingID: ', listingID);
    try {
      approval = await approve({ args: [marketplaceContractAddress, listingPrice] });
      // console.log("wbc amount approval success", approval);
      // console.log("approval status", approval.receipt.status)
    } catch (err) {
      // console.log("wbc amount approval failure", err);
    }

    if (approval && approval.receipt.status === 1) {
      try {
        // console.log('Buying...')
        const transaction = await buyNFT({ args: [listingID] });
        // console.info("contract call successs", transaction);
      } catch (err) {
        // console.error("contract call failure", err);
      }
    }
  }

  const buyWithETH = async (listingPrice, listingID) => {
    try {
      console.log('Buying with ETH...')
      // console.log('listingPrice: ', listingPrice)

      // const ethAmount = ethers.utils.parseEther(listingPrice);
      const transaction = await buyNFT({ args: [listingID],  overrides: { value: listingPrice }});
      await transaction.wait(); // Wait for the transaction to be mined
      console.log('NFT bought with ETH');
    } catch (error) {
      console.error('Failed to buy NFT with ETH', error);
    }
  };

  return (
    <section className='buynft__container'>
      <h1>Buy An NFT!</h1>
      <div className='buynft__owned-grid'>
        {/* {console.log('Entering `liveListings` map function...')} */}
        {liveListings && liveListings.map((listing, index) => {
          return (
            <div key={index} className='listing-flex'>
              
              {/* {console.log('Entering ShowListedNFTs Component...')} */}

              <ShowListedNFTs listing={listing} marketplaceContract={marketplaceContract} />
                
              <button className='buynft__button' onClick={() =>
                listing.tokenContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  buyWithETH(listing.price, listing.listingID)
                  :
                  buyWithWBC(listing.price, listing.listingID)}
              >
                Buy with
                {listing.tokenContractAddress === '0x0000000000000000000000000000000000000000'
                  ?
                  ' ETH'
                  :
                  ' ' + tokenSymbol
                }
              </button>
        
        
            </div>
          )
        }
        )}
      </div>
      {/* {console.log('liveListings', liveListings ? liveListings : '')} */}
    </section>
  )
}

export default ViewAuctions
