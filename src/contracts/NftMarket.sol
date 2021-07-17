// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './AuctionToken.sol';
import './ChainlinkElf.sol';
import './ChainlinkOrc.sol';
import './ChainlinkKnight.sol';


contract NftMarket {
    
    address public auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;
    uint256 public startingBid;

    IERC20 public token;
    ERC721 public chainlinkelf;
    ERC721 public chainlinkork;
    ERC721 public chainlinkknight;

    enum auction_state{
        CANCELLED,STARTED
    }

    address[] bidders;
    mapping(address => uint) private balances;
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
            IERC20 _auctionToken,
            ERC721 _chainlinkelf,
            ERC721 _chainlinkorc,
            ERC721 _chainlinkknight
    )
    {
            token = _auctionToken;
            chainlinkelf = _chainlinkelf;
            chainlinkork = _chainlinkorc;
            chainlinkknight = _chainlinkknight;
            auction_owner = msg.sender;
    }

    function startAuction(uint256 amount, uint time) external only_owner returns(bool){
        startingBid = amount;
        auction_start = block.timestamp;
        auction_end = auction_start + time;
        STATE=auction_state.STARTED;
        emit startEvent(amount,auction_start);
        return true;
    }
 

    function bid(uint256 amount) external {
      
        require(amount > highestBid,"You can't bid, Make a higher Bid");
        require(msg.sender != auction_owner, "Owner can't bid");
        if(highestBid != 0){
            uint256 refund = bids[highestBidder];
            token.transferFrom(address(this),highestBidder,refund);
        }
        highestBidder = msg.sender;
        highestBid = amount;
        bids[msg.sender] = amount;
        token.transferFrom(msg.sender,address(this),amount);
        emit BidEvent(highestBidder,highestBid);
    }
  
    function cancel_auction() external only_owner  an_ongoing_auction returns (bool){
    
        STATE=auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", block.timestamp);
        return true;
    }
    
    /*
    function withdraw() public only_owner {
        require(block.timestamp > auction_end ,"You can't withdraw, the auction is still open");
        //uint256 tokenId = nft.getTokenId();
        //collectible.approve(highestBidder,tokenId);
        //collectible.safeTransferFrom(auction_owner,highestBidder,tokenId);
        
        //emit WithdrawalEvent(msg.sender,tokenId); 
    }*/

    function ownedERC721() external view returns(uint256[]memory){
        

    }
}
