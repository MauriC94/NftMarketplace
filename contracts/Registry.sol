// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NftMarket.sol";

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract Registry {

    struct User{
        address userWallet;
        string username;
        string password;
    }

    struct NftAuction {
        address contractAddress;
        uint256 amount;
        uint256 date;
        uint256 time;
        ERC721 erc721;
        ERC20 erc20;
        uint256 tokenId;
        address owner;
    }

    struct NftData {
        address contractAddress;
        uint256 tokenId;
        string jsonAbi;
        string uri;
        string name;
        string symbol;
    }

    struct TokenData {
        address contractAddress;
        address owner;
        string jsonAbi;
        string name;
        string symbol;
        uint8 decimals;
    }

    //mapping users
    mapping(string => User) public users;
    //mapping users name
    mapping(address => string) public userName;

    // mapping aste
    mapping(address => NftAuction) internal auctions;
    address[] public allAuctions;
    uint public contractCreated = 0;
    // mapping admin
    mapping(address => bool) internal isAdmin;

    //mapping erc20
    mapping(string => TokenData) internal allToken;
    //mapping erc721
    mapping(string => NftData) internal allNft;

    //mapping erc721 address - symbol
    mapping(address => string) public nftSymbol;
    //mapping erc721 address - abi
    mapping(address => string) public nftAbi;

    //mapping erc721 address - auction
    mapping(ERC721 => address) public nftAuction;

    address[]public nft;
    address[]public token;

    event AdminAdded(address indexed _from, address indexed _who);
    event AuctionCreated(address _owner, address _auction);

    constructor() {
        isAdmin[msg.sender] = true;
        emit AdminAdded(address(0), msg.sender);
    }

    function makeAdmin(address _address) public {
        require(isAdmin[msg.sender],"Must be admin to create another admin");
        isAdmin[_address] = true;
        emit AdminAdded(msg.sender, _address);
    }

    function addUser(address _userWallet ,string memory _username, string memory _password) public {
        User memory tempUserData = User({
            userWallet: _userWallet,
            username: _username,
            password: _password
        });
        users[_username] = tempUserData;
        userName[_userWallet] = _username;
    }

    function getUser(string memory _username) public view returns(address,string memory,string memory){
        return(
            users[_username].userWallet,
            users[_username].username,
            users[_username].password
        );
    }

    function addErc721(
        address _erc721,
        string memory _abi_json,
        uint256 _tokenId,
        string memory _uri,
        string memory _name,
        string memory _symbol
    ) public {
        require(isAdmin[msg.sender], "Must be admin to add erc721 contracts");

        NftData memory tempNftData = NftData({
            contractAddress: _erc721,
            jsonAbi: _abi_json,
            tokenId: _tokenId,
            uri: _uri,
            name: _name,
            symbol: _symbol
        });
        allNft[_symbol] = tempNftData; 
        nft.push(_erc721);
        nftSymbol[_erc721] = _symbol;
        nftAbi[_erc721] = _abi_json;
    }

    function getNftToken(string memory _symbol) public view returns(address,uint256,string memory, string memory,string memory,string memory){
        return(
            allNft[_symbol].contractAddress,
            allNft[_symbol].tokenId,
            allNft[_symbol].jsonAbi,
            allNft[_symbol].uri,
            allNft[_symbol].name,
            allNft[_symbol].symbol
        );
    }

    function getNftArray() public view returns(address[]memory){
        return nft;
    }

    function addErc20(
        address _erc20,
        address _owner,
        string memory _abi_json,
        string memory _name,
        string memory _symbol,
        uint8 _decimals 
    ) public {
        require(isAdmin[msg.sender], "Must be admin to add erc20 contracts");

        TokenData memory tempTokenData = TokenData({
            contractAddress: _erc20,
            owner: _owner,
            jsonAbi: _abi_json,
            name: _name,
            symbol: _symbol,
            decimals: _decimals
        });
        allToken[_symbol] = tempTokenData;
        token.push(_erc20);
    }

    function getToken(string memory _symbol) public view returns(address,address,string memory,string memory,string memory,uint8){
        return(
            allToken[_symbol].contractAddress,
            allToken[_symbol].owner,
            allToken[_symbol].jsonAbi,
            allToken[_symbol].name,
            allToken[_symbol].symbol,
            allToken[_symbol].decimals
        );
    }

    function createAuction(
        uint256 _amount,
        uint256 _date,
        uint256 _time,
        ERC721 _erc721,
        ERC20 _erc20,
        uint256 _tokenId
    ) public{
        NftMarket auctionContract = new NftMarket(
            _amount,
            _date,
            _time,
            _erc721,
            _erc20,
            _tokenId,
            msg.sender
        );
        NftAuction memory tempAuctionData = NftAuction({
            contractAddress: address(auctionContract),
            amount: _amount,
            date: _date,
            time: _time,
            erc721: _erc721,
            erc20: _erc20,
            tokenId: _tokenId,
            owner: msg.sender
        });
        auctions[address(auctionContract)] = tempAuctionData;
        nftAuction[_erc721] = address(auctionContract);
        allAuctions.push(address(auctionContract));
        contractCreated++;
        emit AuctionCreated(msg.sender,address(auctionContract));
    }

    function getAuction(address _addr) public view returns(uint256,uint256,uint256,ERC721,uint256,address,address){
        return(
            auctions[_addr].amount,
            auctions[_addr].date,
            auctions[_addr].time,
            auctions[_addr].erc721,
            auctions[_addr].tokenId,
            auctions[_addr].contractAddress,
            auctions[_addr].owner
        );
    }
}
