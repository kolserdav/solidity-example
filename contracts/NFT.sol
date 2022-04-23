//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721URIStorage  {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable public beneficiary;

    uint32 countTokens = 1000000;
    mapping(address => uint256[]) tokens;

    constructor(address payable _beneficiary) ERC721("MyToken", "MTK") {
        beneficiary = _beneficiary;
    }

    function mint(string memory _value) external payable {
        uint256 cost = 0.001 ether;
        require(msg.value == cost, string(abi.encodePacked("Pay value must be ", Strings.toString(cost), ". Received ", Strings.toString(msg.value))));
        require(countTokens > 0, "No more new tokens");
        uint8 maxTokens = 100;
        require(balanceOf(msg.sender) < maxTokens, string(abi.encodePacked("Max amount tokens is ", Strings.toString(maxTokens))));
        beneficiary.transfer(cost);
        countTokens--;
         _tokenIds.increment();
        uint256 newToken = _tokenIds.current();
        _mint(msg.sender, newToken);
        tokens[msg.sender].push(newToken);
        _setTokenURI(newToken, _value);
    }

    function getUserTokens(address _owner) public view returns (uint256[] memory) {
        return tokens[_owner];
    }

     function getCountTokens() public view returns (uint256) {
        return countTokens;
    }
}
