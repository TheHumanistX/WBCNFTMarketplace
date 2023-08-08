Some general notes:

- You will see `try{}/catch{}` blocks all throughout the web app. These are simply for error handling. Try this code and if there is an error, catch it and do whatever is in the `catch{}` block.
    - You will see an [`AlertModal`](#alert-modal) component in some of the `try{}/catch{}` blocks. This is used to catch an error and then display a small modal to inform the user of some issue or error. This is only used in areas where it seems logical to present this information directly to the user. Some of these modals give the information to the user and some direct the user to check the console... otherwise the rest of the `catch{}` blocks will just log to the console to avoid red-screen errors and to at least provide the error information in the console if a user is so inclined to check the console.
    - You will also see some `try{}/catch{}` blocks with specific error codes referenced. This was to separate certain errors like 'user rejected request' or when the users MetaMask is locked.

- We have `constants.js` which holds `TOKEN_CONTRACT_ADDRESS`, `ETH_NULL_ADDRESS`, and `MARKETPLACE_CONTRACT_ADDRESS` so that we can easily reference them where needed and then if we need to change them we can just change them in our constants file.

# App.js
Set up of router and providers
- Wrap app in EthersProvider so that we can use the context and its custom hook anywhere in the app.
- Wrap ThirdWebProvider AND rest of app in ThirdWebProvider so we can use the ConnectWallet component for nice wallet connection button.

------------------------------------

# Contexts
Needed to split one large context into multiple contexts for better separation of concerns.
We have a custom hook at the bottom of each context that allows us to grab what we need from contexts with out needing `useContext` throughout the app. Instead, we just import the custom hook from whichever context and use that to pull what we need from the context.
We have `useEthers`, `useMarketplace`, `useNFT`, `useToken`...

## `EthersContext`

This context is used for getting base ethers set up (provider, signer, wallet, network/chain, etc)

We establish `provider`, `signer`, `userWalletAddress`, `network`, and `chainName` in this context so that they can be used easily throughout the app without having to rerun all this code each time we need any of these... also allows us to avoid prop-drilling.

We have two listeners to listen for either the chain or wallet being changed in MetaMask.

At the end of the `useEffect`, we have our initial run/setup of `ethersDataSetup` and then we also 
call this function to rerun when either chain or account is changed.

Also, this context imports the other three contexts so that we wrapped the app in just EthersProvider and that wraps the app in all four contexts. You can see this in the `return()` method of the `EthersContext`.

We pass `provider` and `signer` to all three of these other contexts as props and also pass `userWalletAddress` to the NFTContext.

## <a id="MarketplaceContext"></a>`MarketplaceContext`

This context is used for setting up a few needs from the marketplace contract.  
Pretty self-explanatory.

## `NFTContext`

This context is use for setting up the NFT collection contract and a few variables.
Again, self-explanatory.

## `TokenContext`

This context is used for setting up any variables that will be needed throughout the app in regard to the ERC20 token contract.

--------------------------------

# Pages

This is possibly a mislabeled folder as I kind of think (now) that `pages` should only be JSX that calls components... so if I had, for example, the `BuyNFT.js` that had no real react/js going on and instead was just setting up the layout for the BuyNFT page.  But, organizing these as 'pages' just worked for me at the time.

## <a id="home"></a>`Home.js`

- This is just the home page. Has a logo image and a CTA button to get to the marketplace. 

## <a id="contact"></a>`Contact.js`

- Simple contact page.  Set the users wallet address automatically in a disabled form element so that if they had problems and needed to contact marketplace support, it auto injects their wallet address and doesn't give them the opportunity to edit that so we know it is correct.

## <a id="marketplace"></a>`Marketplace.js`

- 'Main' page of the marketplace section of the app.  Title image, nice scrolling marquee ([`MarqueeScroller`](#MarqueeScroller) component) with gifs of various NFT collections (including crazyfaces), then the 2 x 2 grid for the buttons to take us to the four transactional sections of the marketplace.

## <a id="buy_nft"></a>`BuyNFT.js`

- This is the page of the marketplace that lists any active sales for users to potentially buy.

## <a id="sell_nft"></a>`SellNFT.js`

- This is the page of the marketplace that lists any NFTs from a specific collection that the user holds in their wallet and gives them the option to list the NFTs with either ETH or ERC-20 as the currency.

## <a id="create_auction"></a>`CreateAuction.js`

- This is the page of the marketplace that lists any NFTs from a specific collection that the user holds in their wallet and gives them the option to create an auction for the NFTs with either ETH or ERC-20 as the currency.

## <a id="view_auctions"></a>`ViewAuctions.js`

- This is the page of the marketplace that lists any active auctions for users to potentially bid on. 


# Breaking down the four transactional 'Pages'

## BuyNFT

Import various dependencies, contexts, components, custom hooks, and a utility function.

### `useLocation` is used to allow up to determine where in the web app we are. We can then set the exact path (i.e. `/buy_nft`, `/sell_nft`, `/create_auction`, `/view_auctions`) which we can then use for some conditional rendering.  Won't explain this over and over but you will see it throughout the code.



# Components

### <a id="alert-modal"></a>`AlertModal` 
- This is the modal mentioned near the beginning that is used in the `catch{}` of some `try{}/catch{}` blocks.  It needs two state variables `modalText` and `isOpen`.  If `isOpen` === true, the modal will display the text in `modalText`.

- You can see in the `AlertModal.js` how this works. If `isOpen` === false, then it simply returns null (i.e. does not display the modal), and if it is true, it returns some JSX. It is a simple modal using z-index and positioning to display, when needed. Also has an overlay which is the area behind the modal (when open) that basically greys out the page behind the modal.

### <a id="AuctionSalesManagementButton"></a>`AuctionSalesManagementButton` 
- This is the button that will display toward the top right corner of the current page and just below the header.  It only displays if the current user has one or more of active listings they created which they can cancel, expired auctions they created that no one bid on that they can now collect, and/or auctions they won and can now collect. The modal that is controlled by this button is called `SaleAuctionManagementModal`.  

### <a id="BidOnNFT"></a>`BidOnNFT` 

- Component that handles the actual placing of a bid in either ETH or ERC-20.
- Multiple props passed from [`showListedNFTs`](#ShowListedNFTs) component.
- Three small components declared at top of this component, `BidInput`, `BidWithETH`, `BidWithWBC`.
  - `BidInput` handles the manual input of the bid amount.
  - `BidWithETH` uses the `BidInput` component to handle the user entering their bid amount and then the `BidWithETH` component handles the submission after the amount is set.  The submission is passed to `handleBidWithETH`.
  - `BidWithWBC` uses the `BidInput` component to handle the user entering their bid amount and then the `BidWithWBC` component handles the submission after the amount is set.  The submission is passed to `handleBidWithWBC`.  OR `BidWithWBC` also has the option for the user to not manually set a bid amount and instead auto-bid the minimum allowable bid amount. This is `current bid + minimum bid increment`.  I incorpoated this for the WBC bidding because the marketplace contract has a `erc20BidIncrement` function that bids this amount automatically instead of a user-set amount.
- The main `BidOnNFT` component has both `handleBidWithETH` and `handleBidWithWBC` functions which simple call the functions `bidWithETH` or `bidWithWBC`, respectively, from the grandparent `ViewAuctions` component.
- The `BidWithETH` or `BidWithWBC` components are rendered conditionally based on whether the payment contract address is the Ethereum NULL Address or the contract address for the WBC(TurtleCat Coin) token contract.

### <a id="Header"></a>`Header` 

- Simple header to display small text logo on left, nav menu in middle, connect wallet button on right.
- Only place we use ThirdWeb because their `<ConnectWallet />` component/button is nicely set up and super easy to implement.  
- [`Navigation`](#Navigation) component that handles the actual nav menu is imported and called in this component.

### <a id="MarqueeScroller"></a>`MarqueeScroller` 

- Wanted a nice horizontally scrolling set of gifs that represent various nft collections.  This was a very simple way to do that.  
- Used [`react-fast-marquee`](https://github.com/justin-chu/react-fast-marquee) to facilitate this.
- Downloaded/Saved 8 gifs off opensea from various popular collections and then created a gif for the CrazyFaces custom collection (the collection used in the NFT Minting dApp project).  This marquee scrolls right to left and has the various gifs animating through different NFTs from these collections. Just looked nice on the main marketplace page.

### <a id="Navigation"></a>`Navigation` 

- Small component that handles the creation and display of the navigation menu that lives in the [`Header`](#Header) component.
- Begin with creation of `NAV__LINKS` object array.  This tells what the nav menu should display ('home', 'marketplace', 'contact') for the nav menu links and where each of these links should direct the user ('/home', '/marketplace', '/contact')
- We create an unordered list and then map through `NAV__LINKS` to create the three list items that will be the three nav menu links.

### <a id="OwnedNFTs"></a>`OwnedNFTs` 

- Component that is imported into and used in [`SellNFT`](#sell_nft) and [`CreateAuction`](#create_auction).  
- Uses the `ownedNFTs` array which is an array of tokenIds of the NFTs from the specified collection that are owned by the current user wallet.  `ownedNFTs` is declared in both [`SellNFT`](#sell_nft) and [`CreateAuction`](#create_auction), utilizing the [`useOwnedNFTs`](#useOwnedNFTs) custom hook to fetch those token IDs owned by the user. `ownedNFTs` array is then passed down as a prop to `OwnedNFTs` component.
- In this component it is displayed how many NFTs from this current collection the user holds (if any) and then we map through `ownedNFTs` array and within that mapping we call the [`ShowOwnedNFTs`](#ShowOwnedNFTs) component to display the owned NFTs.

### <a id="PurchaseNFT"></a>`PurchaseNFT` 

- This component is basically the last in the line of components that are involved in purchasing a listed nft (not an auction).
- `buyWithETH` and `buyWithWBC` functions from [`BuyNFT`](#buy_nft) are props for this component
- We are simply determining whether `paymentContractAddress` is the Ethereum null address or the contract address for the ERC-20 token (WBC TurtleCat Coin, in this instance).
- Depending on which it is, we call `buyWithETH` or `buyWithWBC` and also conditionally render our button to either say 'Buy with ETH' or 'Buy with `tokenSymbol`'
  - `tokenSymbol`, in this case, being 'WBC'.
  
### <a id="SaleAuctionManagementModal"></a>`SaleAuctionManagementModal` 
- This is another simple (style-wise) modal that will open when the user clicks the [`AuctionSalesManagementButton`](#AuctionSalesManagementButton).  This modal pulls in `activeSales`, `expiredAuctions`, and `wonAuctions` arrays that hold the `listingID`/`auctionID`, `tokenID`, and `nftContractAddress` of any active sales, expired auctions, or won auctions that belong to the user.         
  - [`useCheckAuctionCollectSalesCancel`](#useCheckAuctionCollectSalesCancel) custom hook handles the logic of creating these arrays inside the [`BuyNFT`](#buy_nft), [`SellNFT`](#sell_nft), [`ViewAuctions`](#view_auctions), and [`CreateAuction`](#create_auction) components.
- We have three conditional renders in the `return()` method for this component that are based on the length of the arrays passed to this component.  If an array has a length > 0, we call the `ListingSection` component.
  - We pass in the component [`ShowCollectibleNFTs`](#ShowCollectibleNFTs) in this component, which is used to display any NFTs for which the IDs exist in any of the `activeSales`, `expiredAuctions`, or `wonAuctions` arrays.
- Created the small component, `ListingSection` before declaration of `SaleAuctionManagementModal`. This is simply used to display the title ('Auctions Won', 'Auctions Expired', 'Cancel Sales') and description of the section and then we call from within this component the [`ShowCollectibleNFTs`](#ShowCollectibleNFTs) component to display the individual nfts. 

### <a id="ShowCollectibleNFTs"></a>`ShowCollectibleNFTs` 

- Component used in the [`SaleAuctionManagementModal`](#SaleAuctionManagementModal)
- Displays the image for any NFTs for which the IDs exist in any of the `activeSales`, `expiredAuctions`, `wonAuctions`.
- Also will display a button to 'Collect' if there are any `expiredAuctions` or `wonAuctions` or to 'Cancel' is there are any `activeSales`.
- We pass `cancelOrCollectSuccesful` & `setCancelOrCollectSuccesful` from the [`MarketplaceContext`](#MarketplaceContext). This is simply used as a back-and-forth switch. It doesn't matter if it is true or false. It is simply used to trigger a re-render of the `useEffect` in [`useCheckAuctionCollectSalesCancel`](#useCheckAuctionCollectSalesCancel). When ever the state of `cancelOrCollectSuccesful` changes, the `useEffect` in the [`useCheckAuctionCollectSalesCancel`](#useCheckAuctionCollectSalesCancel) custom hook will re-render and we will no longer see that nft from either the collected auction or canceled sale.
- We have a `handleAction` function which utilizes our `actionMap` object.
  - The `actionMap` is a dictionary where each key is one of the three possible status codes we have been tracking for our three possible arrays, `activeSales`, `expiredAuctions`, and `wonAuctions`.
    - Each of these keys has an `action` (This is a function that either collects the nft from an expired or won auction, or a function that cancels an active sale), `altText` (For the nft image alt text), `buttonText` ('Collect' or 'Cancel').
    - The array elements are passed one at a time to `ShowCollectibleNFTs`, so it has one single status code to refer to.  
  - We set up `handleCollect` function to use the `endAuction` function from the smart contract and the `handleCancelSale` function to use the `cancelListing` function from the smart contract
  - Those functions are called by the `handleAction` function to actually collect or cancel.
  - We utilize the custom hook [`useFetchNftData`](#useFetchNftData) to grab the metadata for the nft so we can display the image.

### <a id="ShowListedNFTs"></a>`ShowListedNFTs` 

- This component is used to display the NFTs, from the specified NFT collection, that are available to purchase through an active sale or bid on through an active auction.
- Utilize `path` to conditionally render in the `return()` method based on whether this is a sale or an auction.
- [`useListing`](#useListing) custom hook used to determine if direct sale or auction and then return a `currentListing` object with the appropriate variables.
- NFT metadata retrieved using [`useFetchNftData`](#useFetchNftData)
- Separated out two smaller components within this component file, `NFTImage` and `NFTMeta`
  - `NFTImage` returns the Listing or Auction ID, the nft image, and the nft ID.
  - `NFTMeta` returns the nft name and the various attributes for the nft (hair, eyes, etc)
- If the path === buy_nft, we pass down to [`PurchaseNFT`](#PurchaseNFT), otherwise if the path === view_auctions, we pass down to [`BidOnNFT`](#BidOnNFT)
- If the path === view_auctions, we also implement the [`TimeRemaining`](#TimeRemaining) component to display the countdown timer until the expiration of the auction.


### <a id="ShowOwnedNFTs"></a>`ShowOwnedNFTs` 

- This component is used to display the nfts currently owned by the current wallet in the specified nft collection.
- We fetch nft metadata using [`useFetchNftData`](#useFetchNftData).
- We conditionally render inside the `return()` method depending on if path === /sell_nft or path === /create_auction.
- We step down into the [`SubmitSaleListing`](#SubmitSaleListing) component if path === /sell_nft
- We step down into the [`SubmitAuctionCreation`](#SubmitAuctionCreation) component if path === /create_auction.
- This component is called from within [`sell_nft`](#sell_nft) and [`create_auction`](#create_auction) inside a `.map` function and processes one NFT at a time.

### <a id="SubmitAuctionCreation"></a>`SubmitAuctionCreation` 

- This component is used handle the auction creation form and to finally submit a newly created auction once the user has filled out the information in the auction creation form.
- The `handleSubmit` function prevents the default submission behavior with the use of `e.preventDefault()` and then passes back some data to the [`CreateAuction`](#create_auction) or [`SellNFT`](#sell_nft) components so they can handle the creation of the auction or sale listing.
  - It then sets the associated variables back to being empty/null so that when the user submits the form, the inputs the user entered into the form will not persist, visually.  This piece was not as necessary for auction create or sale listing creation as it was for bidding on auctions where when a user bid, without clearing the data, it would just show the form with the old inputs unless you refreshed the page manually.
- Just a simple form element in the `return()` method to allow the user to enter the necessary auction creation information.`

### <a id="SubmitNFTContractAddress"></a>`SubmitNFTContractAddress` 

- A small and simple component that is used in the [`CreateAuction`](#create_auction) and [`SellNFT`](#sell_nft) components.  
- In order to know which collection from which the user would like to auction or sell nfts, we need them to input the nft collection's contract address.  Of course, this isn't necessary on much larger nft marketplaces but with this small project, it was easiest this way.
- This component simple provides the form element for the user to input that contract address and submit it.  We then `setNFTContractAddress` in the `handleSubmit` function.

### <a id="SubmitSaleListing"></a>`SubmitSaleListing` 

- Similar component to [`SubmitAuctionCreation`](#SubmitAuctionCreation) that allows for the actual creation of a sale listing.
- Form element in `return()` method to handle the input of this information.
- `handleListingSubmission` prevents normal submission activity and then passes the `price` and `tokenId` back up through components to the [`CreateAuction`](#create_auction) component so that component can handle the actual creation of the auction.

### <a id="TimeRemaining"></a>`TimeRemaining` 

- Component to display and countdown the remaining time in Days, Hours, Minutes, Seconds for any active auctions.
- The `setTimerComplete` is another 'switch' variable.  When `timerComplete` changes from the previous value (true/false), it triggers a rerender of the page so that when an auction becomes expired or won after time runs out, the auction automatically no longer displays on the [`ViewAuctions`](#view_auctions) page.

# Custom hooks

### <a id="useCheckAuctionCollectSalesCancel"></a>`useCheckAuctionCollectSalesCancel`

- Custom hook that is called in [`BuyNFT`](#buy_nft), [`SellNFT`](#sell_nft), [`CreateAuction`](#create_auction), and [`ViewAuctions`](#view_auctions).
- Hook is used to check, in reference to the current wallet, if there are any active sales, expired auctions, or won auctions.
- The hook fetches the ID of the last created auction or sale listing. `Promise.all` is used because we are expecting to trigger multiple promises while mapping through an array we will create in the next step and we do not want to move forward in the code until ALL promises are returned. It then uses `Array.from` to create an array that has a length === `lastListingID`.  For example, if the `lastListingID` is 5, the array has indexes `[0,1,2,3,4]`.  Then the array is mapped through, the listing type of each listing (using the array index for the `listingID`/`auctionID`) is fetched, then the `listingID` and `listingType` are returned, creating an object array.  
  - Then we iterate through the object array and conditionally determine if each array element/object is referring to either an active sale listing that belongs to the current wallet, an expired auction listing that belongs to the current wallet, or a won auction with the current wallet as `topBidder`. We assign them to the appropriate array (`usersActiveSales`, `usersExpiredAuctions`, `usersWonAuctions`) if the pass any of these conditions. We had to pass the `setIsOpen` & `setModalText` as props because we do not return any JSX in this hook, so we have to use the [`AlertModal`](#alert-modal) that is declared in the four possible parent Pages listed above.

### <a id="useFetchNftData"></a>`useFetchNftData`

### <a id="useListing"></a>`useListing`

### <a id="useOwnedNFTs"></a>`useOwnedNFTs`

### <a id="useSpendWithETH"></a>`useSpendWithETH`

### <a id="useSpendWithWBC"></a>`useSpendWithWBC`


# Utility functions

### <a id="approveNFTTransfer"></a>`approveNFTTransfer`



### <a id="approveTokenSpend"></a>`approveTokenSpend`



### <a id="bidOnAuctionInputChecks"></a>`bidOnAuctionInputChecks`



### <a id="buyListingCheck"></a>`buyListingCheck`



### <a id="createAuctionInputChecks"></a>`createAuctionInputChecks`



### <a id="createNewAuction"></a>`createNewAuction`



### <a id="createNewListing"></a>`createNewListing`



### <a id="ethSpend"></a>`ethSpend`



### <a id="sendTransaction"></a>`sendTransaction`



### <a id="tokenSpend"></a>`tokenSpend`

