# App.js
## Imports

### react-router-dom
- Navigate
- Route
- Routes
  
### @thirdweb-dev/react
#### Only needed for the connect wallet button... must wrap app in `<ThirdwebProvider> ... </ThirdwebProvider>`
- ThirdwebProvider
  
### Various components, 'pages', and context

--------------------
STEP IN TO HEADER.JS (Component)

--------------------


# Header.js

## Imports

### 'ConnectWallet' from ThirdwebProvider

### Navigation component to display navigation menu

--------------------
STEP IN TO NAVIGATION.js (Component)

--------------------

# Navigation.js

## Imports 

### NavLink from react-router-dom

- Used `NavLink` because, unlike `<Link>`, `<NavLink>` knows if a link is active or not, allowing for easy styling based on active/unactive links.

## Logic

### `NAV__LINKS`

- Object array that will be mapped through to create our navigation menu.
- In the `return()` method you can see we map through `NAV__LINKS` and create a new list item (`<li>`) for each and then, in `App.css`, we style this unordered list so that we end up with a horizontal navigation menu.

--------------------
STEP BACK OUT TO APP.JS
STEP IN TO HOME.JS (Page)

--------------------

# Home.js

## Imports

### NavLink from react-router-dom
### Logo graphic

## Logic 

- `NavLink` used for CTA button that takes user directly to Marketplace.js
  
--------------------
STEP BACK OUT TO APP.JS
STEP IN TO CONTACT.JS (Page)

--------------------

# Contact.js

## Imports

### Just EthersContext

## Logic
- Contact form that automatically adds the user's wallet address to the form in a disabled element so it cannot be accidentally edited by user.

--------------------
STEP BACK OUT TO APP.JS
STEP IN TO MARKETPLACE.JS (Page)

--------------------

# Marketplace.Just

## Imports

### `NavLink` from react-router-dom
### `MarqueeScroller` component
### Title graphic

## Logic

### `NAV__LINKS`
- Object array that will be mapped through to create our navigation menu.
- In the `return()` method you can see we map through `NAV__LINKS` and create a new list item (`<li>`) for each and then, in `App.css`, we style this unordered list so that we end up with a two column/two row grid navigation menu.

--------------------
STEP IN TO MarqueeScroller.js (Component)

--------------------

# MarqueeScroller.js

## Imports

### `Marquee` from `react-fast-marquee`
### `crazyFaces` gif for the marquee

## Logic

### `<Marquee> </Marquee>`

- Simple horizontally scrolling marquee. Grabbed multiple gifs off OpenSea from various NFT collections plus incorporated the CrazyFaces imported gif to create nice horizontally scrolling set of gifs of various NFT collections that sits below the title image in Marketplace.js

--------------------
STEP BACK OUT TO MARKETPLACE.JS
STEP IN TO BuyNFT.JS (Page)

--------------------

# BuyNFT.js

## Imports

### `useLocation` from `react-router-dom`
### `EthersContext` and `MarketplaceContext`
### Components, custom hooks, utility function

## Logic

### `location` & `path`

- `useLocation` from `react-router-dom` allows us to pull the current location in the web app. We can then get the actual path (i.e. `/buy_nft`, `/view_auctions`, `/sell_nft`, `/create_auction`) so that we can have some conditions that are based on the current path of the web app.  For example, if we are in BuyNFT.js (path === `/buy_nft`), then do one thing and if we are in ViewAuctions.js (path === `/view_auctions`), then do this other thing.

###  Calling multiple variables from contexts and initializing various state variables

### Setting variables `activeSales`, `expiredAuctions`, `wonAuctions` with custom hook `useCheckAuctionCollectSalesCancel`

------------------------
STEP IN TO useCheckAuctionCollectSalesCancel.js (Custom Hook)

------------------------

# useCheckAuctionCollectSalesCancel.js

## Imports

### contexts

## Logic

### Calling multiple variables from contexts and initializing various state variables

### `useEffect`

- Verify `marketplaceContract` exists
  - `checkAuctionCollectSalesCancel`
    - fetch ID of last listing/auction created
    - declare `listingData`
      - using Promise.all because we will be expecting multiple promises returned in this function and we don't want to continue in the code until ALL promises have been returned.
      - `Array.from` creates an array with length === `lastListingId`, so if lastListingId is 5, the array is `[0, 1, 2, 3, 4]`
      - `(_, i) => i` is simply a mapping function that returns the current index for each element in the Array
      - Fetching type of each (listing/auction)
      - Returning object which contains the listingId/auctionId and the type (listing/auction)
    - `for()`
      - Iterating through the object array.
      - If listingType === 1 (listing) or else if listingType === 2 (auction), 
        - determine status of listing/auction
        - fetch owner of the listing/nft
        - fetch NFT tokenId of the listed/auctioned NFT
        - fetch contract address for that nft collection
      - If the owner of the listing/nft is the web app user
        - Check if listing is sale listing and if it is an active sale and push to `usersActiveSales` array, if so
        - Else, check if listing is auction and if has status of expired and the topBidder is `0x00..00` (meaning no one bid on the auction) and push to `usersExpiredAuctions` array, if so
      - Else if the user is not the owner/creator and it is an auction and it has a status of 'won', and the topBidder (i.e. winner) is the user, push to the `usersWonAuctions` array


