// Deployed Goerli: 0xf94a9747C20076D56F84320aCF36431dAE557Fb7
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICrazyFaces {

    function safeMint(address to) external;

    function tokenURI(uint256 tokenId) external view returns (string memory);

    function getLastTokenID() external view returns(uint256);

    function balanceOf(address owner) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);

    function name() external view  returns (string memory);

    function symbol() external view returns (string memory);

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId) external view returns (address);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address owner, address operator) external view returns (bool);

    function transferFrom(address from, address to, uint256 tokenId) external;

    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;
}