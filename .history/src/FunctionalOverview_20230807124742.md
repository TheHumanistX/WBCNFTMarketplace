# App.js
Set up of router and providers
- Wrap app in EthersProvider so that we can use the context and its custom hook anywhere in the app.
- Wrap ThirdWebProvider AND rest of app in ThirdWebProvider so we can use the ConnectWallet component for nice wallet connection button.

# Contexts
Needed to split one large context into multiple contexts for better separation of concerns.

## EthersContext

This context is used for getting base ethers set up (provider, signer, wallet, etc)



## MarketplaceContext


## NFTContext


## TokenContext