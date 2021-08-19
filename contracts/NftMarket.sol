// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        OFF,STARTED,ENDED
    }

    address[]public bidders;
    uint public biddersCount = 0;
    mapping(address => uint) public pendingReturns;
    mapping(address => uint) public bids;

    auction_state public STATE;


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
    
    /*
    constructor (
            IERC20 _auctionToken
    )
    {
            token = _auctionToken;
            STATE = auction_state.OFF;
    }
    */

    constructor(
        uint256 amount, 
        uint time, 
        ERC721 _nftContract, 
        ERC20 _tokenContract,
        uint256 erc721Id
    ){
       
        auction_owner = payable(msg.sender);
        auction_time = time;
        startingBid = amount;
        tokenId = erc721Id;
        auction_end = block.timestamp + time;
        STATE=auction_state.STARTED;
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
        highestBidder = msg.sender;
        highestBid = amount;
        bids[msg.sender] += amount;
        token.transferFrom(msg.sender,address(this),amount);

        emit BidEvent(highestBidder,highestBid);
    }
  
    function cancel_auction() external only_owner  an_ongoing_auction returns (bool){
        STATE=auction_state.OFF;
        emit CanceledEvent("Auction Cancelled", block.timestamp);
        return true;
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

    function auctionEnd() payable public returns(bool){
        require(block.timestamp > auction_end ,"You can't withdraw, the auction is still open");
        STATE=auction_state.ENDED;
        erc721Contract.transferFrom(auction_owner, highestBidder, tokenId);
        emit ERC721Transfer(highestBidder,tokenId);
        resetAuction();
        return true;
    }

    function getWin() public payable only_owner{
        token.transfer(auction_owner,highestBid);
        emit ERC20Transfer(auction_owner,highestBid);
        highestBid = 0;
    }

    function resetAuction() public returns(bool){
        auction_end = 0;
        startingBid = 0;
        tokenId = 0;

        for(uint i=0; i<biddersCount; i++){
            address bidder = bidders[i];
            bids[bidder] = 0;
        }
        return true;
    }
}
