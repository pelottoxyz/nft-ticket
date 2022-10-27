// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PelottoNFT is ERC721, Pausable, ReentrancyGuard  {
    
    address private immutable _defender;
    uint256 public tokenIdCounter = 1;

    constructor(address defender) ERC721("PelottoNFT", "PELOTTO") {
        require(defender != address(0));
        _defender = defender;
    }

    function mint(
        bytes32 hash,
        bytes memory signature
    )
        whenNotPaused
        nonReentrant
        external
    {
        uint256 tokenId = tokenIdCounter;
        require(
            hash == keccak256(abi.encode(msg.sender, tokenId, address(this))),
            "Invalid hash"
        );
        require(
            ECDSA.recover(ECDSA.toEthSignedMessageHash(hash), signature) == _defender,
            "Invalid signature"
        );
        tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
    }

    function pause() external {
        require(msg.sender == _defender, "Unauthorized");
        _pause();
    }

    function unpause() external {
        require(msg.sender == _defender, "Unauthorized");
        _unpause();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://app.pelotto.xyz";
    }
    
}

