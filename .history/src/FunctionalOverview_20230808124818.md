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

This is possibly a mislabeled folder as I kind of think (now) that `Pages` should only be JSX that calls components... so if I had, for example, the `BuyNFT.js` that had no real react/js going on and instead was just setting up the layout for the BuyNFT page.  But, organizing these as 'pages' just worked for me at the time.

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


# Breaking down the four transactional 'Pages' (BuyNFT, CreateAuction, SellNFT, ViewAuctions)

### `useLocation` is used in all four Pages to allow us to determine where in the web app we are. We can then set the exact path (i.e. `/buy_nft`, `/sell_nft`, `/create_auction`, `/view_auctions`) which we can then use for some conditional rendering.  Won't explain this over and over but you will see it throughout the code.


## BuyNFT

- This Page is used to display any NFTs that are currently listed as direct sales.
- We utilize the custom hooks [`useCheckAuctionCollectSalesCancel`](#useCheckAuctionCollectSalesCancel), [`useSpendWithWBC`](#useSpendWithWBC), and [`useSpendWithETH`](#useSpendWithETH).
  - These are explained more in-depth below. Click the hook names to go to their respective descriptions.
- We have a `useEffect` that handles fetching and determine any current active listings.
  - We declare the `fetchListingStatuses` function.
  - We fetch the ID of the last direct sale or auction to populate the variable `getLastListingID`.
  - We create an array `listingData`
    - `Promise.all` is used because we will possibly have multiple promises returning and we want to wait on all of them before we move forward.
    - The array is given a length equal to the `getLastListingID` variable.
      - For example, if `getLastListingID` === 4, the array will have indexes `[0,1,2,3]`.
    - We then map through the array and for each index, we return an object container the `listingID` (this also can be an `auctionID`) and the `listingType` (direct sale or auction).
    - We then create a new array `listingTypes` which is just the `listingData` object array filtered for only `listingType`s of 1, which is the direct sale listing type.
      - This is determined by referring to the `ItemType` ENUM in the marketplace contract.
        - 1: Direct Sale and 2: Auction
    - We then create a new array `listingStatuses` amd map through the `listingTypes` array and check the status of each listing that is in that array. 
      - We again use `Promise.all` so we make sure we have gotten all promises back before moving forward.
    - We declare the `activeListings` array which is `listingTypes` array filtered only for statuses of 1, which is an active sale listing. This is also based on an ENUM in the marketplace contract.
    - We declare the `currentListings` object array. 
      - We want to wait until all promises are returned, so we use `Promise.all`
      - We map `activeListings` array
        - We call the `getListing` function from the marketplace contract using each listingID, which returns an object.
        - This new object is then pushed added to the `currentListings` array
    - We then `setLiveListings(currentListings)` to update the state variable `liveListings` with the current and updated direct sale listings.
  - We then map the `liveListings` array in the `return()` method and each listing is passed down to the [`ShowListedNFTs`](#ShowListedNFTs) component, which handles the display of each listed sale or auction.
  - The [`AuctionSalesManagementButton`](#AuctionSalesManagementButton) component is implemented to display the button for the user to manage any active sales or expired/won auctions, if they exist. If they do not exist, the button is not displayed.
  - The [`AlertModal`](#alert-modal) component is implemented to display certain errors when necessary in a more presentable manner than the typical red screen error in the browser.
  - We have the `buyWithWBC` and `buyWithETH` functions which just handle the purchasing of an NFT sale listing with either the ERC-20 token or ETH native coin.

## ViewAuctions

- This Page is used to display any NFTs that are currently listed as direct sales.
- We utilize the custom hooks [`useCheckAuctionCollectSalesCancel`](#useCheckAuctionCollectSalesCancel), [`useSpendWithWBC`](#useSpendWithWBC), and [`useSpendWithETH`](#useSpendWithETH).
  - These are explained more in-depth below. Click the hook names to go to their respective descriptions.
- We have a `useEffect` that handles fetching and determine any current active listings.
  - We declare the `fetchAuctionStatuses` function.
  - We fetch the ID of the last direct sale or auction to populate the variable `getLastListingID`.
  - We create an array `listingData`
    - `Promise.all` is used because we will possibly have multiple promises returning and we want to wait on all of them before we move forward.
    - The array is given a length equal to the `getLastListingID` variable.
      - For example, if `getLastListingID` === 4, the array will have indexes `[0,1,2,3]`.
    - We then map through the array and for each index, we return an object container the `listingID` (this also can be an `auctionID`) and the `listingType` (direct sale or auction).
    - We then create a new array `listingTypes` which is just the `listingData` object array filtered for only `listingType`s of 2, which is the auction listing type.
      - This is determined by referring to the `ItemType` ENUM in the marketplace contract.
        - 1: Direct Sale and 2: Auction
    - We then create a new array `auctionStatuses` amd map through the `listingTypes` array and check the status of each auction that is in that array. 
      - We again use `Promise.all` so we make sure we have gotten all promises back before moving forward.
    - We declare the `activeListings` array which is `listingTypes` array filtered only for statuses of 1, which is an active sale listing. This is also based on an ENUM in the marketplace contract.
    - We declare the `currentListings` object array. 
      - We want to wait until all promises are returned, so we use `Promise.all`
      - We map `activeListings` array
        - We call the `getListing` function from the marketplace contract using each listingID, which returns an object.
        - This new object is then pushed added to the `currentListings` array
    - We then `setLiveListings(currentListings)` to update the state variable `liveListings` with the current and updated direct sale listings.

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
  - Then we iterate through the object array and conditionally determine if each array element/object is referring to either an active sale listing that belongs to the current wallet, an expired auction listing that belongs to the current wallet, or a won auction with the current wallet as `topBidder`. We assign them to the appropriate array (`usersActiveSales`, `usersExpiredAuctions`, `usersWonAuctions`) if they pass any of these conditions. 
- We had to pass the `setIsOpen` & `setModalText` as props because we do not return any JSX in this hook, so we have to use the [`AlertModal`](#alert-modal) that is declared in the four possible parent Pages listed above.
- We also `setDisplayButton` to true if any of the three arrays are populated. This displays the button on one of the four parents Pages in the upper right that allows the user to open the modal to manage their active sales, expired auctions, or won auctions.

### <a id="useFetchNftData"></a>`useFetchNftData`

- Small custom hook to simply first fetch the URI of the current NFT, in the first `useEffect`.  
- Once that is fetched, in the second `useEffect` we take the `nft` state variable that was defined in the previous step and we reformat the IPFS url so it is accessible from any browser.  
- We then use that url to fetch the json metadata for the nft and return that metadata to the parent component.

### <a id="useListing"></a>`useListing`

- This custom hook take in a listing from either [`BuyNFT`](#buy_nft) or [`ViewAuctions`](#view_auctions) and determines (condionally based on the `path`) which variables will be needed.  If the path === /buy_nft, it returns one set of variables, if the path === /view_auctions, it returns a different set of variables.

### <a id="useOwnedNFTs"></a>`useOwnedNFTs`

- This hook is used to simply retrieve the token IDs of the nfts owned by the current user's wallet from a specified collection.
- We were running into an error that I determined was caused by the user leaving a page before some of the asynchronous operations were complete in this specific hook.  That is why we have the `isMounted` code throughout the `useEffect`.
  - This simple makes sure that, if the component is not currently mounted (i.e. user navigated away), the asynch operations stop running.  If the user is still on the page, the operations complete and then the `isMounted` is set to false in the cleanup.
- We create an array of length `lastNFTMintedID`. This is the last nft minted in the specified collection.  If the `lastNFTMintedID` === 6, the array has indexes `[0,1,2,3,4,5]`.
  - We then map through this array and at each index we fetch the owner of the nft with that token ID.
    - If the owner of that nft === the current users wallet address, we add that token Id to the `tokenIdsOwndByWallet` array.
    - We then `setOwnedNFTs` to that array and return `ownedNFTs` to the parent component so it now has an array of nft token Ids owned by the current user.

### <a id="useSpendWithETH"></a>`useSpendWithETH`

- Small custom hook that essentially houses some logic for initiating a transaction using ETH.
- This hook has `setIsOpen` and `setModalText` passed to it so that the [`AlertModal`](#alert-modal) in the parent component (either [`BuyNFT`](#buy_nft) or [`ViewAuctions`](#view_auctions)) can display an error if needed.
- In this hook we declare the `spendWithETH` function which will then call the utility function [`ethSpend`](#ethSpend) to create the new transaction using ETH.
- The hook returns the `spendWithETH` function so that it can be used in one of the two possible parent components mentioned above.

### <a id="useSpendWithWBC"></a>`useSpendWithWBC`

- Very similar to the previous [`useSpendWithETH`](#useSpendWithETH) custom hook but for use with the WBC (TurtleCat Coin) ERC-20 token.
  - This also requires approval which we initiate in this hook.
- We declare the `spendWithWBC` function which calls the [`approveTokenSpend`](#approveTokenSpend) utility function to get approval for spending the ERC-20 token from the user's wallet.
  - We then move on, assuming no errors, to call the [`tokenSpend`](#tokenSpend) utility function to create a new transaction using the ERC-20 token.
- The hook returns the `spendWithWBC` function so that it can be used in one of the two possible parent components mentioned above.

# Utility functions

### <a id="approveNFTTransfer"></a>`approveNFTTransfer`

- This utility function simple handles the approval process for listing an NFT from the selected nft collection on the marketplace.  
- The function either returns the approval or `null` (if there is an error). 

### <a id="approveTokenSpend"></a>`approveTokenSpend`

- This utility function is used in the [`useSpendWithWBC`](#useSpendWithWBC) custom hook.  
- This function is simply used to handle the approval process for spending the ERC-20 token in the user's wallet.
- The function either returns the approval or `null` (if there is an error).

### <a id="bidOnAuctionInputChecks"></a>`bidOnAuctionInputChecks`

- This utility function just handles a series of checks that are necessary before a user's auction bid can move forward.  This is utilized in the [`ViewAuctions`](#view_auctions) Page inside the `bidWithWBC` and `bidWithETH` functions.  
- The function is checking that `bidAmount` is, in fact, a number and greater than zero.
- The function is checking that the `bidAmount` is not less than the `minimumAllowableBid`.
- The function is checking that the current user's wallet is not also the `owner` of the auction, because we do not allow the owner of an auction to bid on their own auction.
- If any of those checks fail, we return `false`, otherwise we return `true`.

### <a id="buyListingCheck"></a>`buyListingCheck`

- Similar to the previous utility function, this function is simply used to run a check before moving forward with an nft purchase inside either the `buyWithWBC` or `buyWithETH` functions in the [`BuyNFT`](#buy_nft) Page.
- The function is checking that the current user's wallet is not also the `owner` of the sale listing, because we do not allow the owner of a sale listing to purchase their own listing.
- If that check fails, we return `false`, otherwise we return `true`.

### <a id="createAuctionInputChecks"></a>`createAuctionInputChecks`

- Another utility function to run a series of checks.
- This function is for the create of a new auction in the `handleCreateAuction` function in the [`CreateAuction`](#create_auction) Page.
- The function checks that the `initialBidAmount` is a number and greater than zero.
- The function checks that the minimum `bidIncrement` is a number and greater than zero.
- The function checks that the `auctionBeginTime` and `auctionEndTime` are not empty form elements.
- The function checks that the `auctionBeginTime` and `auctionEndTime` are in the future.
- If any of those checks fail, we return `false`, otherwise we return `true`.

### <a id="createNewAuction"></a>`createNewAuction`

- This utility function is used in the [`CreateAuction`](#create_auction) Page and handles the transactional portion of creating a new auction.  
- We conditionally render one portion or the other portion depending if the currency for the listing is ETH or the ERC-20 token.
- The function is passed the `approval` from the [`approveNFTTransfer`](#approveNFTTransfer) utility function, and first checks that the approval was successful.
- Because `createAuction` in the marketplace contract is an overloaded function (two 'versions' of the function exist depending if the user wants to use ETH or ERC-20 for the payment currency), we have to declare it a little differently because JavaScript/React does not natively support function overloading.
  - We must first create a string that represents the specific 'version' of the overloaded function we would like to call.
    - There is a string declared both for an auction created with ETH as the listing currency and another declared for an auction created with ERC-20 as the listing currency.
  - We then call the function using this string 'signature' 
    - We must use the `functions` object on our contract instance and then pass that object our desired function `signature` as a key. This ensures that we are calling the exact version of the overloaded function that we want.
    - This lets us bypass JavaScript's lack of native function overloading support.
- Upon a successful auction creation, we `setTxConfirm` which is a state variable instantiated in [`CreateAuction`](#create_auction) that we pass to [`useOwnedNFTs`](#useOwnedNFTs). Inside that custom hook, the `useEffect` has `txConfirm` as a dependency, so when `txConfirm` is changed/updated, that `useEffect` will re-run which will then re-render the nfts owned by the user that are displayed on the [`CreateAuction`](#create_auction) Page. This will remove the nft (from display on the Page) for which they just created an auction. 
  - Basically, they now cannot accidentally create a new auction listing for the same nft because it is no longer displaying with the other NFTs that they can still auction off.

### <a id="createNewListing"></a>`createNewListing`

- This utility function is very similar to the previous [`createNewAuction`](#createNewAuction) utility function.
- This function is used by the [`SellNFT`](#sell_nft) Page. 
- We conditionally render one portion or the other portion depending if the currency for the listing is ETH or the ERC-20 token.
- The function is passed the `approval` from the [`approveNFTTransfer`](#approveNFTTransfer) utility function, and first checks that the approval was successful.
- Because `createListing` in the marketplace contract is an overloaded function (two 'versions' of the function exist depending if the user wants to use ETH or ERC-20 for the payment currency), we have to declare it a little differently because JavaScript/React does not natively support function overloading.
  - We must first create a string that represents the specific 'version' of the overloaded function we would like to call.
    - There is a string declared both for a sale listing created with ETH as the listing currency and another declared for a sale listing created with ERC-20 as the listing currency.
  - We then call the function using this string 'signature' 
    - We must use the `functions` object on our contract instance and then pass that object our desired function `signature` as a key. This ensures that we are calling the exact version of the overloaded function that we want.
    - This lets us bypass JavaScript's lack of native function overloading support.
- Upon a successful sale listing creation, we `setTxConfirm` which is a state variable instantiated in [`SellNFT`](#sell_nft) that we pass to [`useOwnedNFTs`](#useOwnedNFTs). Inside that custom hook, the `useEffect` has `txConfirm` as a dependency, so when `txConfirm` is changed/updated, that `useEffect` will re-run which will then re-render the nfts owned by the user that are displayed on the [`SellNFT`](#sell_nft) Page. This will remove the nft (from display on the Page) for which they just created a direct listing. 
  - Basically, they now cannot accidentally create a new sale listing for the same nft because it is no longer displaying with the other NFTs that they can still sell.
  
### <a id="ethSpend"></a>`ethSpend`

- This utility function is called inside the [`useSpendWithETH`](#useSpendWithETH) custom hook.
- The function is used to determine the type of transaction.  
  - Either buying a sale listing or bidding on an auction.
    - We use `path` to determine whether we are handling an auction or a direct sale.
- We then, depending on the `path`, prepare a transaction and then call the [`sendTransaction`](#sendTransaction) utility function to actually execute the transaction.
- `createEthTransaction` (a callback function) is used to prepare the transaction and then call the appropriate contract function.
  - This function sets up the transaction but doesn't send it. 
  - Instead, the [`sendTransaction`](#sendTransaction) function sends the transaction using the details provided by the callback function
  - For a direct sale, it sets up a transaction using `contract.buyETHNFT(listingID, { value: value });`
  - For bidding on an auction, it sets up a transaction using `contract.ethBidAmount(listingID, { value: value });`
  - This way, [`sendTransaction`](#sendTransaction) remains generic and can be reused for various types of transactions, while the specifics are managed by `ethSpend`.

### <a id="sendTransaction"></a>`sendTransaction`

- This utility function is a general-purpose function that sends transactions. It doesn't concern itself with the specific details of the transaction. 
  - Instead, it expects `createTransactionCallback` function that, when called, will set up and return the specific transaction that needs to be executed.
  - It also expects any number of additional arguments (...args) that the `createTransactionCallback` might need.
- The function sets up the transaction using the provided `createTransactionCallback`.
  - If the transaction is successful, `setTxConfirm` is run which, in the case of buying an nft or bidding for an auction, cause the `useEffect` in either [`BuyNFT`](#buy_nft) or [`ViewAuctions`](#view_auctions) to re-run because `txConfirm` is a dependency of the `useEffect` in those pages.  
    - This means that, upon successful purchase of a sale listing or bid on an auction, either the sale listing will disappear from [`BuyNFT`](#buy_nft) or the current bid information will update to reflect the new bid on the [`ViewAuctions`](#view_auctions) Page for that specific auction.
  
### <a id="tokenSpend"></a>`tokenSpend`

- This utility function is very similar to [`ethSpend`](#ethSpend).  It essentially does the exact same thing EXCEPT that it is passed the `approval` parameter since we are dealing with an ERC-20 token in this utility function instead of the native ETH coin.
-  The function is called from within the [`useSpendWithWBC`](#useSpendWithWBC) custom hook.
- The function is used to determine the type of transaction.  
  - Either buying a sale listing or bidding on an auction.
    - We use `path` to determine whether we are handling an auction or a direct sale.
- We then, depending on the `path`, prepare a transaction and then call the [`sendTransaction`](#sendTransaction) utility function to actually execute the transaction.
- `createTokenTransaction` (a callback function) is used to prepare the transaction and then call the appropriate contract function.
  - This function sets up the transaction but doesn't send it. 
  - Instead, the [`sendTransaction`](#sendTransaction) function sends the transaction using the details provided by the callback function, `createTokenTransaction`.
  - For a direct sale, it sets up a transaction using `contract.buyERC20NFT(listingID);`
  - For bidding on an auction, it sets up a transaction using `contract.erc20BidAmount(listingID, value);`
  - This way, [`sendTransaction`](#sendTransaction) remains generic and can be reused for various types of transactions, while the specifics are managed by `tokenSpend`.

