# App.js
Set up of router and providers
- Wrap app in EthersProvider so that we can use the context and its custom hook anywhere in the app.
- Wrap ThirdWebProvider AND rest of app in ThirdWebProvider so we can use the ConnectWallet component for nice wallet connection button.

# Contexts
Needed to split one large context into multiple contexts for better separation of concerns.
We have a custom hook at the bottom of each context that allows us to grab what we need from contexts with out needing `useContext`.  
We have `useEthers`, `useMarketplace`, `useNFT`, `useToken`...

## EthersContext

This context is used for getting base ethers set up (provider, signer, wallet, etc)
Also, this context imports the other three contexts so that we wrapped the app in just EthersProvider and that wraps the app in all four contexts. 


## MarketplaceContext


## NFTContext


## TokenContext