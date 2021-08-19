// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./NftMarket.sol";

contract Registry {
    struct NftAuction {
        address contractAddress;
        uint256 amount;
        uint256 time;
        ERC721 erc721;
        ERC20 erc20;
        uint256 tokenId;
    }

    struct NftData {
        ERC721 contractAddress;
        address owner;
        uint256 tokenId;
        string jsonAbi;
        string uri;
        string name;
        string symbol;
    }

    struct TokenData {
        ERC20 contractAddress;
        address owner;
        string jsonAbi;
        string name;
        string symbol;
        uint8 decimals;
    }

    struct TokenUser {
        address user;
        string[]tokenSymbols;
        uint size;   
    }

    struct NftUser {
        address user;
        string[]nftSymbols;
        uint size;
    }

    // mapping aste
    mapping(address => NftAuction) internal auctions;
    // mapping admin
    mapping(address => bool) internal isAdmin;

    //mapping erc20
    mapping(string => TokenData) internal token;
    //mapping erc721
    mapping(string => NftData) internal nft;

    //mapping erc20 property
    mapping(address => TokenUser) internal tokenProperty;
    //mapping erc721 property
    mapping(address => NftUser) internal nftProperty;

    event AdminAdded(address indexed _from, address indexed _who);

    constructor() {
        isAdmin[msg.sender] = true;
        // inizializzare a 0 le struct size
        emit AdminAdded(address(0), msg.sender);
    }

    function makeAdmin(address _address) public {
        require(isAdmin[msg.sender],"Must be admin to create another admin");
        isAdmin[_address] = true;
        emit AdminAdded(msg.sender, _address);
    }

    function addErc721(
        ERC721 _erc721,
        address _owner,
        string memory _abi_json,
        uint256 _tokenId,
        string memory _uri,
        string memory _name,
        string memory _symbol
    ) public {
        require(isAdmin[msg.sender], "Must be admin to add erc721 contracts");

        NftData memory tempNftData = NftData({
            contractAddress: _erc721,
            owner: _owner,
            tokenId: _tokenId,
            jsonAbi: _abi_json,
            uri: _uri,
            name: _name,
            symbol: _symbol
        });
        nft[_symbol] = tempNftData;

        // set new data

        nftProperty[_owner].nftSymbols.push(_symbol);
        nftProperty[_owner].size += 1; 
    }

    function getOwnedNft(address _address) public view returns(uint,string[]memory array){
        return(
            nftProperty[_address].size,
            nftProperty[_address].nftSymbols
        );
    }

    function getNftToken(string memory _symbol) public view returns(ERC721,address,uint256,string memory, string memory,string memory,string memory){
        return(
            nft[_symbol].contractAddress,
            nft[_symbol].owner,
            nft[_symbol].tokenId,
            nft[_symbol].jsonAbi,
            nft[_symbol].uri,
            nft[_symbol].name,
            nft[_symbol].symbol
        );
    }

    function addErc20(
        ERC20 _erc20,
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
        token[_symbol] = tempTokenData;

        // set new data

        tokenProperty[_owner].tokenSymbols.push(_symbol);
        tokenProperty[_owner].size += 1;
    }

    function getOwnedToken(address _address) public view returns(uint,string[]memory array){
        return(
            tokenProperty[_address].size,
            tokenProperty[_address].tokenSymbols
        );
    } 

    function getToken(string memory _symbol) public view returns(ERC20,address,string memory,string memory,string memory,uint8){
        return(
            token[_symbol].contractAddress,
            token[_symbol].owner,
            token[_symbol].jsonAbi,
            token[_symbol].name,
            token[_symbol].symbol,
            token[_symbol].decimals
        );
    }

    function createAuction(
        uint256 _amount,
        uint256 _time,
        ERC721 _erc721,
        ERC20 _erc20,
        uint256 _tokenId
    ) public {
        NftMarket auctionContract = new NftMarket(
            _amount,
            _time,
            _erc721,
            _erc20,
            _tokenId
        );
        NftAuction memory tempAuctionData = NftAuction({
            contractAddress: address(auctionContract),
            amount: _amount,
            time: _time,
            erc721: _erc721,
            erc20: _erc20,
            tokenId: _tokenId
        });
        auctions[address(auctionContract)] = tempAuctionData;
    }

    function getAuction(address _addr) public view returns(uint256,uint256,ERC721,ERC20,uint256){
        return(
            auctions[_addr].amount,
            auctions[_addr].time,
            auctions[_addr].erc721,
            auctions[_addr].erc20,
            auctions[_addr].tokenId
        );
    }
}
