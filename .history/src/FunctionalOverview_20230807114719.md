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

--------------------

# Navigation.js

## Imports 

### NavLink from react-router-dom

- Used `NavLink` because, unlike `<Link>`, `<NavLink>` knows if a link is active or not, allowing for easy styling based on active/unactive links.