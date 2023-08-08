Some general notes:

- You will see `try{}/catch{}` blocks all throughout the web app. These are simply for error handling. Try this code and if there is an error, catch it and do whatever is in the `catch{}` block.
    - You will see an `AlertModal` component in some of the `try{}/catch{}` blocks. This is used to catch an error and then display a small modal to inform the user of some issue or error. This is only used in areas where it seems logical to present this information directly to the user. Some of these modals give the information to the user and some direct the user to check the console... otherwise the rest of the `catch{}` blocks will just log to the console to avoid red-screen errors and to at least provide the error information in the console if a user is so inclined to check the console.
    - You will also see some `try{}/catch{}` blocks with specific error codes referenced. This was to separate certain errors like 'user rejected request' or when the users MetaMask is locked.

- We have `constants.js` which holds `TOKEN_CONTRACT_ADDRESS`, `ETH_NULL_ADDRESS`, &`MARKETPLACE_CONTRACT_ADDRESS` so that we can easily reference them where needed and then if we need to change them we can just change them in our constants file.

# App.js
Set up of router and providers
- Wrap app in EthersProvider so that we can use the context and its custom hook anywhere in the app.
- Wrap ThirdWebProvider AND rest of app in ThirdWebProvider so we can use the ConnectWallet component for nice wallet connection button.

------------------------------------

# Contexts
Needed to split one large context into multiple contexts for better separation of concerns.
We have a custom hook at the bottom of each context that allows us to grab what we need from contexts with out needing `useContext` throughout the app. Instead, we just import the custom hook from whichever context and use that to pull what we need from the context.
We have `useEthers`, `useMarketplace`, `useNFT`, `useToken`...

## EthersContext

This context is used for getting base ethers set up (provider, signer, wallet, network/chain, etc)

We establish `provider`, `signer`, `userWalletAddress`, `network`, and `chainName` in this context so that they can be used easily throughout the app without having to rerun all this code each time we need any of these... also allows us to avoid prop-drilling.

We have two listeners to listen for either the chain or wallet being changed in MetaMask.

At the end of the `useEffect`, we have our initial run/setup of `ethersDataSetup` and then we also 
call this function to rerun when either chain or account is changed.

Also, this context imports the other three contexts so that we wrapped the app in just EthersProvider and that wraps the app in all four contexts. You can see this in the `return()` method of the `EthersContext`.

We pass `provider` and `signer` to all three of these other contexts as props and also pass `userWalletAddress` to the NFTContext.

## MarketplaceContext

This context is used for setting up a few needs from the marketplace contract.  
Pretty self-explanatory.

## NFTContext

This context is use for setting up the NFT collection contract and a few variables.
Again, self-explanatory.

## TokenContext

This context is used for setting up any variables that will be needed throughout the app in regard to the ERC20 token contract.

--------------------------------

# Pages

This is possibly a mislabeled folder as I kind of think (now) that `pages` should only be JSX that calls components... so if I had, for example, the `BuyNFT.js` that had no real react/js going on and instead was just setting up the layout for the BuyNFT page.  But, organizing these as 'pages' just worked for me at the time.

## Home.js

- This is just the home page. Has a logo image and a CTA button to get to the marketplace. 

## Contact.js

- Simple contact page.  Set the users wallet address automatically in a disabled form element so that if they had problems and needed to contact marketplace support, it auto injects their wallet address and doesn't give them the opportunity to edit that so we know it is correct.

## Marketplace.js

- 'Main' page of the marketplace section of the app.  Title image, nice scrolling marquee ([`MarqueeScroller` component](#MarqueeScroller)) with gifs of various NFT collections (including crazyfaces), then the 2 x 2 grid for the buttons to take us to the four transactional sections of the marketplace.

## BuyNFT.js

- This is the page of the marketplace that lists any active sales for users to potentially buy.

## SellNFT.js

- This is the page of the marketplace that lists any NFTs from a specific collection that the user holds in their wallet and gives them the option to list the NFTs with either ETH or ERC-20 as the currency.

## CreateAuction.js

- This is the page of the marketplace that lists any NFTs from a specific collection that the user holds in their wallet and gives them the option to create an auction for the NFTs with either ETH or ERC-20 as the currency.

## ViewAuctions.js

- This is the page of the marketplace that lists any active auctions for users to potentially bid on. 


# Breaking down the four transactional 'Pages'

## BuyNFT

Import various dependencies, contexts, components, custom hooks, and a utility function.

### `useLocation` is used to allow up to determine where in the web app we are. We can then set the exact path (i.e. `/buy_nft`, `/sell_nft`, `/create_auction`, `/view_auctions`) which we can then use for some conditional rendering.  Won't explain this over and over but you will see it throughout the code.



- `useCheckAuctionCollectSalesCancel.js` is a custom hook that fetches the ID of the last created auction or sale listing. `Promise.all` is used because we are expecting to trigger multiple promises while mapping through an array we will create in the next step and we do not want to move forward in the code until ALL promises are returned. It then uses `Array.from` to create an array that has a length === `lastListingID`.  For example, if the `lastListingID` is 5, the array has indexes `[0,1,2,3,4]`.  Then the array is mapped through, the listing type of each listing (using the array index for the `listingID`/`auctionID`) is fetched, then the `listingID` and `listingType` are returned, creating an object array.  
  - Then we iterate through the object array and conditionally determine if each array element/object is referring to either an active sale listing that belongs to the current wallet, an expired auction listing that belongs to the current wallet, or a won auction with the current wallet as `topBidder`. We assign them to the appropriate array (`usersActiveSales`, `usersExpiredAuctions`, `usersWonAuctions`) if the pass any of these conditions. We had to pass the `setIsOpen` & `setModalText` as props because we do not return any JSX in this hook, so we have to use the `AlertModal` that is declared in which every page is the parent.

- `ShowCollectibleNFTs` 

# Components

### <a id="alert-modal"></a>`AlertModal` 
- This is the modal mentioned near the beginning that is used in the `catch{}` of some `try{}/catch{}` blocks.  It needs two state variables `modalText` and `isOpen`.  If `isOpen` === true, the modal will display the text in `modalText`.

- You can see in the `AlertModal.js` how this works. If `isOpen` === false, then it simply returns null (i.e. does not display the modal), and if it is true, it returns some JSX. It is a simple modal using z-index and positioning to display, when needed. Also has an overlay which is the area behind the modal (when open) that basically greys out the page behind the modal.

### <a id="AuctionSalesManagementButton"></a>`AuctionSalesManagementButton` 
- This is the button that will display toward the top right corner of the current page and just below the header.  It only displays if the current user has one or more of active listings they created which they can cancel, expired auctions they created that no one bid on that they can now collect, and/or auctions they won and can now collect. The modal that is controlled by this button is called `SaleAuctionManagementModal`.  

### <a id="BidOnNFT"></a>`BidOnNFT` 
### <a id="Header"></a>`Header` 
### <a id="MarqueeScroller"></a>`MarqueeScroller` 
### <a id="BidOnNFT"></a>`BidOnNFT` 
### <a id="BidOnNFT"></a>`BidOnNFT` 
### <a id="BidOnNFT"></a>`BidOnNFT` 
### <a id="BidOnNFT"></a>`BidOnNFT` 
### <a id="BidOnNFT"></a>`BidOnNFT` 




### <a id="SaleAuctionManagementModal"></a>`SaleAuctionManagementModal` 
- This is another simple modal (style-wise) that will open when the user clicks the `AuctionSalesManagementButton`.  This modal pulls in `activeSales`, `expiredAuctions`, and `wonAuctions` arrays that hold the `listingID`/`auctionID`, `tokenID`, and `nftContractAddress` of any active sales, expired auctions, or won auctions that belong to the user.  `useCheckAuctionCollectSalesCancel.js` custom hook handles the logic of creating these arrays.
  - We al pass in the component `ShowCollectibleNFTs` in this component which is explained after `useCheckAuctionCollectSalesCancel` below.