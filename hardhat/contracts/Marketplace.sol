// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/* import openzeppelin contracts */
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol"; 
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Marketplace {

    using Counters for Counters.Counter; 
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 royalty = 0.050 ether; 

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemid;   
        address nftContract;
        uint256 tokenId; 
        address payable seller; 
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    event NftListed (uint indexed itemId, address indexed nftContract, uint256 indexed tokenId, address seller, address owner, uint256 price, bool sold);

    function getRoyalty() public view returns (uint256) { 
        return royalty;
    }

    function listNftInMarket(address nftContract, uint256 tokenId, uint256 price) public payable {
        require(price > 0, "Price must be at least 1 wei"); 
        require(msg.value == royalty, "Price must be equal to royalty");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        idToMarketItem[itemId] = MarketItem(itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price, false);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);   
        emit NftListed(itemId, nftContract, tokenId, msg.sender, address(0), price, false);
    }
    function saleNFTs(address nftContract, uint256 itemId) public payable {

        uint price = idToMarketItem[itemId].price; 
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "Please submit the asking bid to complete the purchase");
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this),msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(royalty);

    }

    function getUnsoldNFTs() public view returns(MarketItem[] memory) {

        uint itemCount = _itemIds.current();
        uint unsoldNFTsCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;
        MarketItem[] memory unsoldNFTs = new MarketItem[](unsoldNFTsCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i+1].owner == address(0)){
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                unsoldNFTs[currentIndex]=currentItem;
                currentIndex += 1;
            }
        }
        return unsoldNFTs;
    }

    function getPurchasedNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint purchasedNFTCount = 0;
        uint currentIndex = 0;
        for(uint i=0; i < totalItemCount; i++){
            if(idToMarketItem[i+1].owner == msg.sender){
                purchasedNFTCount += 1;
            }
        }
        MarketItem[] memory purchasedNFTs = new MarketItem[](purchasedNFTCount);
        for(uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                purchasedNFTs[currentIndex]=currentItem;
                currentIndex += 1;
            }
        }
        return purchasedNFTs;
    }
}