// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PelottoNFTPass is ERC721, ERC721URIStorage, Pausable, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string public uriPrefix = "";
  string public uriSuffix = ".json";

  uint256 public maxSupply = 10;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix
  ) ERC721(_name, _symbol) {
    setUriPrefix(_uriPrefix);
  }

  function getTokenURI(uint256 _tokenId) public view returns (string memory) {
    require(_exists(_tokenId), "URI does not exist");
    string memory baseUri = _baseURI();
    return string(abi.encodePacked(baseUri, _tokenId.toString(), uriSuffix));
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds.current();
  }

  function mint() public whenNotPaused {
    require(balanceOf(msg.sender) == 0, "Max mint per wallet reached");
    require(_tokenIds.current() <= maxSupply, "No more NFTs left to mint");
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, getTokenURI(newItemId));
  }

  // utils

  function setUriPrefix(string memory _uriPrefix) public onlyOwner {
    uriPrefix = _uriPrefix;
  }

  function setUriSuffix(string memory _uriSuffix) public onlyOwner {
    uriSuffix = _uriSuffix;
  }

  function setMaxSupply(uint256 _maxSupply) public onlyOwner {
    maxSupply = _maxSupply;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function withdraw() public onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }

  // required

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return uriPrefix;
  }
}
