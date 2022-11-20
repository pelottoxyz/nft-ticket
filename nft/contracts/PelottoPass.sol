// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

contract PelottoPass is ERC721, ERC721URIStorage, Pausable, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => string) public teams;

  constructor() ERC721("PelottoPass", "PELOTTO") {
    teams[1] = "Brazil";
    teams[2] = "Argentina";
    teams[3] = "Uruguay";
  }

  function generatePass(uint256 tokenId) public pure returns (string memory) {
    string[8] memory parts;
    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500">';
    parts[1] = "<style>.base { fill: white; font-family: sans-serif; font-size: 14px; }</style>";
    parts[2] = '<rect width="100%" height="100%" fill="black" />';
    parts[3] = '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">PELOTTO</text>';
    parts[4] = '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">';
    parts[5] = Strings.toString(tokenId);
    parts[6] = "</text></svg>";

    bytes memory svg = abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]);

    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  function getTokenURI(uint256 tokenId, uint256 teamId) public view returns (string memory) {
    bytes memory dataURI = abi.encodePacked(
      "{",
      '"name": "Pelotto Pass #',
      tokenId.toString(),
      '",',
      '"description": "Pelotto Pass for ',
      teams[teamId],
      '",',
      '"image": "',
      generatePass(tokenId),
      '"',
      "}"
    );

    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
  }

  function mint(uint256 teamId) public whenNotPaused {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, getTokenURI(newItemId, teamId));
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds.current();
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
