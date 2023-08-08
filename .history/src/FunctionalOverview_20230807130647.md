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