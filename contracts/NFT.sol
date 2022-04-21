//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract NFT {
    uint32 countTokens = 1000000;
    mapping(bytes32 => address) tokens;
    mapping(address => uint32) userCountTokens;

    event Transfer(
        address indexed _from,
        address indexed _to,
        bytes32 indexed _tokenId
    );

    constructor() {
        console.log("Construct NFT");
    }

    function balanceOf() public view returns (uint32) {
        return countTokens;
    }

    function getUserCountTokens() public view returns (uint32) {
        return userCountTokens[msg.sender];
    }

    function ownerOf(bytes32 _tokenId) external view returns (address) {
        return tokens[_tokenId];
    }

    function mint(string memory _count) external payable {
        require(countTokens > 0);
        require(userCountTokens[msg.sender] < 100);
        bytes32 tokenId = keccak256(abi.encodePacked(_count));
        tokens[tokenId] = msg.sender;
        userCountTokens[msg.sender]++;
        countTokens--;
        transfer(address(0), msg.sender, tokenId);
    }

    function transfer(
        address _from,
        address _to,
        bytes32 _token
    ) public {
        emit Transfer(_from, _to, _token);
    }
}
