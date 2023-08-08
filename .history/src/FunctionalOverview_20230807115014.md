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

# Header.js

## Imports

### 'ConnectWallet' from ThirdwebProvider

### Navigation component to display navigation menu


------ STEP IN -------

# Navigation.js

## Imports 

### NavLink from react-router-dom

- Used `NavLink` because, unlike `<Link>`, `<NavLink>` knows if a link is active or not, allowing for easy styling based on active/unactive links.

## Logic

### `NAV__LINKS`

- Object array that will be mapped through to create our navigation menu.
- In the `return()` method you can see we map through `NAV__LINKS` and create a new list item (`<li>`) for each and then, in `App.css`, we style this unordered list so that we end up with a horizontal navigation menu.

--------------------

# Home