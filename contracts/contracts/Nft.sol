// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT721 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // constructor and functions

    constructor() ERC721("MarketItem", "MKI") {}

    function mint(address _receiver) public {
        _tokenIds.increment();
        _mint(_receiver, _tokenIds.current());
    }

    function mintBatch(address _receiver, uint256 _amount) public {
        for (uint256 i = 0; i < _amount; i++) {
            _tokenIds.increment();
            _mint(_receiver, _tokenIds.current());
        }
    }
}
