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

