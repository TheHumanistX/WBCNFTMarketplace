// Deployed to Goerli: 0x43247D35a25d97ebe1360030b8Da2CE5Dfe7FAd6
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./CrazyFaces.sol";
import "./IWBCCoin.sol";
import "./MinterEscrow.sol";

interface INFTMinter {
    event ERC20PaymentReceived(address from, uint256 amount);
    event NFTBought(address indexed buyer, uint256 indexed tokenID);

    /// @notice Returns the WBC price for the next NFT minted
    function getPrice() external view returns(uint256);

    /// @notice Returns the WBC price for the next NFT minted
    function getPrice(uint256 amount) external view returns(uint256);

    /**
     * @notice Purchases a batch of ERC721 NFTs
     * @param amount Amount of NFTs to purchase
     */
    function buyNFTs(uint256 amount) external;

    /// @notice Sets a new mint price
    function setPrice(uint256 newPrice) external;

    /// @notice Returns amount of WBC token earnings available for the caller to collect
    function getEarnings() external view returns(uint256);

    /// @notice Releases the caller's escrowed earnings, if any
    function collectEarnings() external;

    /// @notice Transfers ownership of the NFT contract's mint function to a new owner
    function transferOwnership(address newOwner) external;

    /// @notice Grants an address Admin privileges
    function addAdmin(address newAdmin) external;

    /// @notice Revokes Admin privileges from an address
    function removeAdmin(address newAdmin) external;

    /// @notice Mints a free NFT to the recipient, only accessible to Admins
    function adminMintTo(address recipient) external;

    /// @notice Releases ownership of the Crazy Faces contract back to the caller
    function releaseOwnership() external;

    /// @notice Getter for the total shares held by payees.
    function totalShares() external view returns (uint256);

    /// @notice Getter for the total amount of `token` already released. `token` should be the address of an IERC20 contract.
    function totalReleased(IERC20 token) external view returns (uint256);

    /// @notice Getter for the amount of shares held by an account.
    function shares(address account) external view returns (uint256);

    /// @notice Getter for the amount of `token` tokens already released to a payee. `token` should be the address of an IERC20 contract.
    function released(IERC20 token, address account) external view returns (uint256);

    /// @notice Getter for the amount of payee's releasable `token` tokens. `token` should be the address of an IERC20 contract.
    function releasable(IERC20 token, address account) external view returns (uint256);

    /// @notice Triggers a transfer to `account` of the amount of `token` tokens they are owed, according to their percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20 contract.
    function release(IERC20 token, address account) external;

}