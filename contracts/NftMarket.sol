// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Registry.sol';

import './AuctionToken.sol';
import './DeadpoolErc721.sol';
import './SupermanErc721.sol';
import './HulkErc721.sol';


contract NftMarket {
    
    address payable public auction_owner;
    uint public auction_time;
    uint public auction_end;
    uint256 public highestBid;
    address public highestBidder;
    uint256 public startingBid;

    IERC20 public token;
    ERC721 public erc721Contract;
    uint256 public tokenId;

    enum auction_state{
        STARTED,ENDED,CLOSED
    }

    enum nft{
        PENDING,DELIVERED
    }

    address[]public bidders;
    uint public biddersCount = 0;
    //mapping(address => uint) public bidders;

    mapping(address => uint) public pendingReturns;
    mapping(address => uint) public bids;
    //address[]public bidders; 

    auction_state public auctionState;
    nft public nftState;



    modifier an_ongoing_auction(){ // controlla se l'asta è ancora aperta
        require(block.timestamp <= auction_end);
        _;
    }
    
    modifier only_owner(){ // solo owner
        require(msg.sender==auction_owner);
        _;
    }
    
    event startEvent(uint256 amount, uint time);
    event BidEvent(address indexed highestBidder, uint256 highestBid);  
    event WithdrawalEvent(address withdrawer, uint256 NftTokenURI);  // termina l'asta
    event CanceledEvent(string message, uint256 time);  // annulla l'asta
    event Sent(address from, address to, uint amount);
    event ERC721Transfer(address to, uint token);
    event ERC20Transfer(address to, uint amount);

    constructor(
        uint256 amount, 
        uint time, 
        ERC721 _nftContract, 
        ERC20 _tokenContract,
        uint256 erc721Id,
        address owner
    ){  
        //auction_owner = payable(msg.sender);
        auction_owner = payable(owner);
        auction_time = time;
        startingBid = amount;
        tokenId = erc721Id;
        auction_end = block.timestamp + time;
        auctionState=auction_state.STARTED;
        nftState=nft.PENDING;
        erc721Contract = _nftContract;
        token = _tokenContract;
        //emit startEvent(amount,auction_end);
    }

    function bid(uint256 amount) payable public {
      
        require(amount > highestBid,"You can't bid, Make a higher Bid");
        require(msg.sender != auction_owner, "Owner can't bid");
        uint256 balance = token.balanceOf(msg.sender);
        require(amount <= balance, "Not enough tokens in the wallet");
        if(highestBid != 0){
            uint256 refund = bids[highestBidder];
            pendingReturns[highestBidder] += refund;
        }
        if(bids[msg.sender] == 0){
            addBidder();
        }
        highestBidder = msg.sender;
        highestBid = amount;
        bids[msg.sender] += amount;
        token.transferFrom(msg.sender,address(this),amount);

        emit BidEvent(highestBidder,highestBid);
    }

    function setTokenIdNft(uint256 id) public returns(bool){
        tokenId = id;
        return true;
    }

    function addBidder() public returns(bool){
        bidders.push(msg.sender);
        biddersCount ++;
        return true;
    }

    function checkBidder(address addr) public view returns(bool){
        for(uint i=0; i<biddersCount; i++){
            if(bidders[i] == addr)
                return true;
        }
        return false;
    }  
    
    function withdraw() public payable {
        uint amount = pendingReturns[msg.sender];
        if(amount > 0){
            pendingReturns[msg.sender] = 0;
            token.transfer(msg.sender,amount);
        }
        emit WithdrawalEvent(msg.sender,amount);
    }

    
    function endAuction() public returns(bool){
        auctionState=auction_state.ENDED;
        return true;
    }

    function closeAuction() public returns(bool){
        auctionState=auction_state.CLOSED;
        return true;
    }

    function getReward() payable public returns(bool){
        auctionState = auction_state.ENDED;
        erc721Contract.transferFrom(auction_owner, highestBidder, tokenId);
        nftState=nft.DELIVERED;
        emit ERC721Transfer(highestBidder,tokenId);
        return true;
    }

    function getWin() public payable {
        require(auctionState == auction_state.ENDED, "You need to end the auction first");
        auctionState = auction_state.CLOSED;
        token.transfer(msg.sender,highestBid);
        emit ERC20Transfer(msg.sender,highestBid);
    }
}
