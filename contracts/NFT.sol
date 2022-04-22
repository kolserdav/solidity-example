//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage  {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint32 countTokens = 1000000;
    mapping(address => uint256[]) tokens;

    constructor() ERC721("MyToken", "ITM") {
        console.log("Construct NFT");
    }

    function mint(string memory _value) external payable {
        require(countTokens > 0);
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
