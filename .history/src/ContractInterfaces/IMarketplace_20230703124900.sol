/**
 * @title NFT Marketplace
 * @author CryptoPhoenix
 * @notice This contract is to be used for the NFT Marketplace project. It combines previous projects involving an NFT auction dApp and an NFT purchasing dApp, and rolls them into a single contract that can perform both functionalities. 
 * @notice This contract tracks all item listings under a single ID system that can be used to obtain either Auctions or Listings. Determining if 
 */
// Deployed Goerli 6-27-23: 0x3efF98124E8c0b9f9AcC66d006D2608631d2bEdA
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface NFTMarketplace {
    event NFTListed(
        address indexed owner, 
        IERC721 indexed nftContract,
        uint256 indexed listingID,
        IERC20 paymentContract,
        uint256 tokenID,
        uint256 price
    );

    event NFTPurchased(
        address indexed owner, 
        IERC721 indexed nftContract,
        uint256 indexed listingID,
        IERC20 paymentContract,
        address buyer,
        uint256 tokenID
    );

    event ListingCanceled(
        address indexed owner,
        IERC721 indexed nftContract,
        uint256 indexed listingID,
        IERC20 paymentContract,
        uint256 tokenID
    );

    event ERC20Deposited(
        address indexed depositor,
        IERC20 token,
        uint256 amount
    );

    event AuctionCreated(
        address indexed owner, 
        IERC721 indexed nftContract,
        uint256 indexed auctionID,
        uint256 tokenID,
        IERC20 paymentContract,
        uint256 initBid,
        uint256 beginDate,
        uint256 expiration
    );

    event AuctionEnded(
        address indexed owner, 
        IERC721 indexed nftContract,
        address indexed winner,
        uint256 tokenID,
        IERC20 paymentContract,
        uint256 topBid
    );

    event ETHDeposited(
        address indexed depositor,
        uint256 amount
    );

    event ETHWithdrawn(
        address indexed depositor,
        uint256 amount
    );

    enum AuctionStatus {
        DOES_NOT_EXIST,
        NEW,
        ACTIVE,
        EXPIRED,
        WON,
        COLLECTED
    }

    enum ListingStatus {
        DOES_NOT_EXIST,
        ACTIVE,
        BOUGHT,
        CANCELLED
    }

    enum ItemType {
        DOES_NOT_EXIST,
        LISTING,
        AUCTION
    }   

    /**
     * @param nftContract Address of ERC721 NFT contract
     * @param tokenID NFT ID
     * @param price ETH price of NFT
     * @param owner Owner of listing
     */
    struct Listing {
        IERC721 nftContract;
        IERC20 paymentContract;
        uint256 tokenID;
        uint256 price;
        address owner;
        ListingStatus status;
    }

    /**
     * @param nftContract Address of ERC721 NFT contract
     * @param tokenID NFT ID
     * @param paymentContract Address of ERC20 payment token contract, or address(0) for ETH
     * @param beginTime Unix timestamp when auction begins
     * @param expiration Unix timestamp when auction ends
     * @param topBidder Address of current top bidder, or zero address if no bidder exists
     * @param currentBid Current top bid
     * @param owner Owner of auction
     */
    struct Auction {
        IERC721 nftContract;
        uint256 tokenID;
        IERC20 paymentContract;
        uint256 beginTime;
        uint256 expiration;
        address topBidder;
        uint256 currentBid;
        uint256 minIncrement;
        address owner;
    }

    /// @notice Returns the current timestamp or block number, depending upon usesTimestamp
    function getCurrentTime() external view returns(uint256);

    /// @notice Returns the time remaining on the auction
    function getTimeRemaining(uint256 auctionID) 
        external view 
    returns(uint256);

    /**
     * @notice Returns the total amount of ERC20 tokens that are ready to use by this contract. This includes internal balances deposited by the bidder or by failed bids, as well as the bidder's external balance that is available for this contract's use.
     */
    function getAvailableBalance(address bidder, IERC20 token) external view returns(uint256);

    function getInternalBalance(address bidder, IERC20 token) external view returns(uint256);

    /// @notice Returns the type of item being queried, used for front-end logic
    /// @return ItemType - AUCTION, LISTING, DOES_NOT_EXIST
    function getItemType(uint256 itemID) external view returns(ItemType);

    /**
     * @notice Returns the current status of an auction.
     * @param auctionID Auction ID to query
     */
    function getAuctionStatus(uint256 auctionID) 
        external view
    returns(AuctionStatus status);

    function getListingStatus(uint256 listingID)
        external view
    returns(ListingStatus status);

    /**
     * @notice Returns a tuple of all Listing properties
     * @param itemID Listing contract's listing ID
     * 
     * @return nftContract Address of NFT contract
     * @return paymentContract Address of ERC20 contract used for buying token
     * @return tokenID NFT contract token ID
     * @return price NFT listing price
     * @return owner NFT owner
     * @return status Listing status (ACTIVE, BOUGHT, CANCELLED)
     */
    function getListing(uint256 itemID) 
        external view 
    returns(
        IERC721 nftContract,
        IERC20 paymentContract,
        uint256 tokenID,
        uint256 price,
        address owner,
        ListingStatus status
    );

        /**
     * @notice Returns a tuple of all Auction properties
     * @param itemID Listing contract's listing ID
     * 
     * @return nftContract Address of NFT contract
     * @return paymentContract Address of ERC20 contract used for buying token
     * @return tokenID NFT contract token ID
     * @return currentBid Current bid for the NFT
     * @return minBidIncrement Minimum amount user must bid to raise current bid
     * @return owner NFT owner
     * @return status Auction's current status: 1 = NEW, 2 = ACTIVE, 3 = EXPIRED, 4 = WON, 5 = COLLECTED
     * @return beginTime Timestamp when this auction begins/began
     * @return expiration Timestamp when this auction ends/ended
     */
    function getAuction(uint256 itemID) 
        external view
    returns(
            IERC721 nftContract,
            IERC20 paymentContract,
            uint256 tokenID,
            uint256 currentBid,
            uint256 minBidIncrement,
            address owner,
            AuctionStatus status,
            uint256 beginTime,
            uint256 expiration
    );
    

    /**
     * @notice Creates a new ERC721 NFT auction with the ERC20 token contract used for bidding
     * 
     * @param _nftContract ERC721 NFT contract address
     * @param _tokenID ERC721 NFT token ID
     * @param _tokenContract ERC20 payment token contract address
     * @param _initBid Initial ERC20 bid to start auction
     * @param _bidIncrement Minimum amount that must be bid to become top bidder
     * @param _beginTime Unix timestamp when auction begins
     * @param _expiration Unix timestamp when auction ends
     */
    function createAuction(
        IERC721 _nftContract,
        uint256 _tokenID,
        IERC20 _tokenContract,
        uint256 _initBid,
        uint256 _bidIncrement,
        uint256 _beginTime,
        uint256 _expiration
    ) external;

    /**
     * @notice Creates a new ERC721 NFT auction with the ERC20 token contract used for bidding
     * 
     * @param _nftContract ERC721 NFT contract address
     * @param _tokenID ERC721 NFT token ID
     * @param _initBid Initial ERC20 bid to start auction
     * @param _bidIncrement Minimum amount that must be bid to become top bidder
     * @param _beginTime Unix timestamp when auction begins
     * @param _expiration Unix timestamp when auction ends
     */
    function createAuction(
        IERC721 _nftContract,
        uint256 _tokenID,
        uint256 _initBid,
        uint256 _bidIncrement,
        uint256 _beginTime,
        uint256 _expiration
    ) external;

    /**
     * @notice Increases the top bid by the bid amount. Recycles internal token balance before transferring tokens from wallet.
     * @param bidIncrement ERC20 token amount to increase bid by
     */
    function bid(uint256 bidIncrement, uint256 auctionID) external payable;

    /// @notice Releases the NFT and ETH to the auction winner and owner
    function endAuction(uint256 auctionID) external;

    /**
     * @notice Creates a new ERC721 NFT listing with an ERC20 token for pricing
     * @param _nftContract ERC721 NFT contract address
     * @param _tokenContract ERC20 token contract address
     * @param _tokenID ERC721 NFT token ID
     * @param _price NFT listing price
     */
    function createListing(
        IERC721 _nftContract,
        IERC20 _tokenContract,
        uint256 _tokenID,
        uint256 _price
    ) external;

    /**
     * @notice Creates a new ERC721 NFT listing with ETH for pricing
     * @param _nftContract ERC721 NFT contract address
     * @param _tokenID ERC721 NFT token ID
     * @param _price NFT listing price
     */
    function createListing(
        IERC721 _nftContract,
        uint256 _tokenID,
        uint256 _price
    ) external;

    /**
     * @notice Purchases an NFT Listing. Uses up internal balance first, then takes the rest externally. Reverts if user sends more ETH than is required to complete the transaction.
     * @param itemID Listing ID of the NFT being purchased
     */
    function buyNFT(uint256 itemID) external payable;


    /// @notice Cancels the NFT listing and returns NFT to owner
    function cancelListing(uint256 itemID) external;

    /// @notice Withdraws all internally stored ERC20 tokens to the caller
    function withdrawAll(IERC20 token) external;

    /// @notice Withdraws a partial amount of internally stored tokens to the caller
    function withdraw(IERC20 token, uint256 amount) external;

    /// @notice Withdraws an amount of ETH held internally to the caller
    function withdrawETH(uint256 amount) external;

    /// @notice Withdraws all ETH held internally to the caller
    function withdrawAllETH() external;

    /// @notice Deposits an amount of ERC20 tokens into the caller's internal balance
    function depositTokens(IERC20 token, uint256 amount) external;
}