// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/* import openzeppelin contracts */
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftToken is ERC721URIStorage{
    using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	address contractAddress;

	constructor(address marketplaceAddress) ERC721("VIMarketPlace", "VI") {
	    contractAddress = marketplaceAddress;
	}

	function mintNFTs(string memory tokenURI) public returns (uint) { 
		_tokenIds.increment();
		uint256 newTokenId=_tokenIds.current();
		_mint(msg.sender, newTokenId);
		_setTokenURI(newTokenId, tokenURI);
		setApprovalForAll(contractAddress, true);
		return newTokenId;
	}
}