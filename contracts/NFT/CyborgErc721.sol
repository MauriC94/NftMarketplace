// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CyborgErc721 is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 newItemId;

  constructor() ERC721("Cyborg","HC"){}

  function awardItem(address recipient, string memory metadata)
  public
  returns (uint256)
  {
    _tokenIds.increment();
    newItemId = _tokenIds.current();
    _mint(recipient,newItemId);
    _setTokenURI(newItemId,metadata);
    return newItemId;
  }

  function getTokenId() public view returns(uint256){
    return newItemId;
  }
}