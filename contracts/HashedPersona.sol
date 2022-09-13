//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract HashedPersona is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //_collectionIds variable has the most recent minted collection
    Counters.Counter private _collectionIds;
    //creator is the contract address that created the smart contract
    address payable creator;
    //The fee charged by the HashedPersona to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;

    // _paused is used to pause the contract in case of an emergency
    bool private _paused = false;

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        uint256 collecitonId;
        address payable owner;
        address payable issuer;
        uint256 tokenAmount;
        uint256 tokenStatus; //0-all; 1-Active; 2-Pending; 3-Suspended; 4-Abandond
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        uint256 collecitonId,
        address payable owner,
        address payable issuer,
        uint256 tokenAmount,
        uint256 tokenStatus
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    //The structure to store info about a collection
    struct ListedCollection {
        uint256 collecitonId;
        uint256 collecitonStartTokenId;
        address payable issuer;
        string collectionURI;
        uint256 maxSupply;
        uint256 numClaimed;
    }
    mapping(uint256 => ListedCollection) private idToListedCollection;

    modifier onlyWhenNotPaused {
        require(!_paused, "Contract currently paused");
        _;
    }

    modifier onlyCreator {
        require(creator == msg.sender, "Only creator is allowed");
        _;
    }

    constructor() ERC721("HashedPersona", "HPC") {
        creator = payable(msg.sender);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(creator == msg.sender, "Only creator can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function setStatus(uint256 tokenId, uint256 newStatus) public {
        require(idToListedToken[tokenId].owner == msg.sender, "Only owner is allowed");
        idToListedToken[tokenId].tokenStatus = newStatus;
    }

    function getStatus(uint256 tokenId) public view returns (uint256) {
        return idToListedToken[tokenId].tokenStatus;
    }

    function setIssuer(address payable newIssuer, uint256 collectionId) public onlyCreator {
        idToListedCollection[collectionId].issuer = newIssuer;
    }

    function getCollectionIdFromTokenId(uint256 tokenId) public view returns (uint256) {
        return idToListedToken[tokenId].collecitonId;
    }

    //The first time a token is created, a collection is created
    function createTokenCollection(string memory collectionURI, uint256 amount) public payable onlyWhenNotPaused returns (uint256) {
        require(amount > 0, "Token amount in this collection is invalid!");
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _collectionIds.increment();
        uint256 newcollectionIds = _collectionIds.current();
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, collectionURI);

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedCollection[newcollectionIds] = ListedCollection(
            newcollectionIds,
            newTokenId,
            payable(msg.sender),
            collectionURI,
            amount,
            0
        );

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, newcollectionIds);

        return newcollectionIds;
    }

    //The first time a token is created, it is listed here
    function createToken(uint256 collectionIds) public payable returns (uint) {
        idToListedCollection[collectionIds].numClaimed += 1;
        uint256 newNumClaimed = idToListedCollection[collectionIds].numClaimed;
        require(newNumClaimed <= idToListedCollection[collectionIds].maxSupply, "Tokens in this collectino are fully collected!");
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, idToListedCollection[collectionIds].collectionURI);

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, collectionIds);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 idCollection) private {
        //Make sure the sender sent enough ETH to pay for listing
        //require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        //require(price > 0, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            idCollection,
            payable(address(msg.sender)),
            idToListedCollection[idCollection].issuer,
            idToListedCollection[idCollection].maxSupply,
            1
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
             tokenId,
            idCollection,
            payable(address(msg.sender)),
            idToListedCollection[idCollection].issuer,
            idToListedCollection[idCollection].maxSupply,
            1
        );
    }
    
    //This will return all the NFTs currently listed to be sold on the HashedPersona
    function getAllCollections() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].issuer == idToListedToken[i+1].owner){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].issuer == idToListedToken[i+1].owner){
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    //Returns all the NFTs that the current user is issuer
    function getMyCollections(address _issuer) public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].issuer == _issuer && idToListedToken[i+1].owner == _issuer){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].issuer == _issuer && idToListedToken[i+1].owner == _issuer){
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //Returns all the NFTs that the current user is owner
    function getMyCards(address _owner) public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == _owner){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == _owner) {
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function collect(uint256 tokenId) public payable {
        //update the details of the token
        uint256 collectionId = getCollectionIdFromTokenId(tokenId);
        createToken(collectionId);
    }

    function setCollectionURI(string calldata newURI, uint256 collectionId) external onlyCreator {
        idToListedCollection[collectionId].collectionURI = newURI;
    }

    function setPaused(bool val) public onlyCreator {
        _paused = val;
    }
    function withdraw() public onlyCreator  {
        address _owner = creator;
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
     // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}

