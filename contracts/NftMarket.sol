// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './AuctionToken.sol';
import './DeadpoolErc721.sol';
import './SupermanErc721.sol';
import './HulkErc721.sol';


contract NftMarket {
    
    address payable public auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;
    uint256 public startingBid;

    IERC20 public token;

    ERC721 public erc721Contract;

    enum auction_state{
        CANCELLED,STARTED
    }

    address [] bidders;
    uint biddersCount = 0;
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
    event BidEvent(address indexed highestBidder, uint256 highestBid); //  
    event WithdrawalEvent(address withdrawer, uint256 NftTokenURI); // termina l'asta
    event CanceledEvent(string message, uint256 time);  // annulla l'asta
    event Sent(address from, address to, uint amount);
    
  
    constructor (
            IERC20 _auctionToken
    )
    {
            token = _auctionToken;
            //auction_owner = payable(msg.sender);
    }

    function startAuction(address owner,uint256 amount, uint time, ERC721 _contract) external returns(bool){
        auction_owner = payable(owner);
        startingBid = amount;
        auction_start = block.timestamp;
        auction_end = auction_start + time;
        STATE=auction_state.STARTED;
        erc721Contract = _contract;
        emit startEvent(amount,auction_start);
        return true;
    }
 

    function bid(uint256 amount) payable public {
      
        require(amount > highestBid,"You can't bid, Make a higher Bid");
        require(msg.sender != auction_owner, "Owner can't bid");
        uint256 balance = token.balanceOf(msg.sender);
        require(amount <= balance, "Not enough tokens in the wallet");
        token.approve(address(this), amount);
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
    
        STATE=auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", block.timestamp);
        return true;
    }

    function addBidder(address bidder) public returns(bool){
        bidders.push(bidder);
        biddersCount ++;

        return true;
    }
    
    
    function withdraw() public returns(bool) {
        uint amount = pendingReturns[msg.sender];
        if(amount > 0){
            pendingReturns[msg.sender] = 0;
            /*
            if(!payable(msg.sender).send(amount)){
                 pendingReturns[msg.sender] = amount;
                 return false;
            }
            */
            token.transferFrom(address(this),msg.sender,amount);
        }
        emit WithdrawalEvent(msg.sender,amount);
        return true; 
    }

    function auctionEnd() public returns(bool){
        require(block.timestamp > auction_end ,"You can't withdraw, the auction is still open");

        uint256 tokenId = 1;
        erc721Contract.approve(highestBidder,tokenId);
        erc721Contract.safeTransferFrom(auction_owner, highestBidder, tokenId);

        return true;
    }

    function resetAuction() public returns(bool){
        auction_start = 0;
        auction_end = 0;
        startingBid = 0;
        highestBid = 0;

        for(uint i=0; i<biddersCount; i++){
            address bidder = bidders[i];
            bids[bidder] = 0;
        }

        return true;
    }
}
