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
    mapping(bytes32 => address) tokens;
    mapping(address => uint32) userCountTokens;

    constructor() ERC721("MyToken", "ITM") {
        console.log("Construct NFT");
    }

    function mint(string memory _value) external payable {
        require(countTokens > 0);
        require(userCountTokens[msg.sender] < 100);
        userCountTokens[msg.sender]++;
        countTokens--;
         _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _value);
        transfer(address(0), msg.sender, newItemId);
    }

    function transfer(
        address _from,
        address _to,
        uint256 _token
    ) public {
        emit Transfer(_from, _to, _token);
    }
}
