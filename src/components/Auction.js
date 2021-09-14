import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import Web3 from 'web3'
import Navbar from './Navbar'
import Nft from './Nft'
import Timer from './Timer'

import NftMarket from '../abis/NftMarket.json'
import Registry from '../abis/Registry.json'
import AuctionToken from '../abis/AuctionToken.json'
import Bidders from './Bidders'
import BidForm from './BidForm'

import './Auction.css';

class Auction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contractAddress: '0x0',
            userAccount: '0x0',
            metadata: [],
            startingBid: '0',
            auctionTime: '0',
            bid: '',
            auctionBids: [],
            timer: false,
            join: false,
            owner: false,
            loading: true
        }
        this.handleAuctionPrice = this.handleAuctionPrice.bind(this);
        this.handleAuctionForm = this.handleAuctionForm.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.getWinBid = this.getWinBid.bind(this);
        this.myAuctions = this.myAuctions.bind(this);
        this.endAuction = this.endAuction.bind(this);
        this.homepage = this.homepage.bind(this);
        this.getBidders = this.getBidders.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.getAuctions = this.getAuctions.bind(this);
    }
    async componentDidMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {

        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const address = localStorage.getItem('address');
        this.setState({ userAccount: address })
        const auctionAddress = localStorage.getItem('auction');
        this.setState({ auctionAddress })
        const registryData = Registry.networks[networkId];
        // Load AuctionData

        if (auctionAddress && registryData) {
            const nftMarket = new web3.eth.Contract(NftMarket.abi, auctionAddress)
            this.setState({ nftMarket })
            let owner = await nftMarket.methods.auction_owner().call();
            const registry = new web3.eth.Contract(Registry.abi, registryData.address)
            this.setState({ registry })
            let startingBid = await nftMarket.methods.startingBid().call();
            this.setState({ startingBid })
            let highestBid = await nftMarket.methods.highestBid().call();
            this.setState({ highestBid })
            let highestBidder = await nftMarket.methods.highestBidder().call();
            if (highestBidder == "0x0000000000000000000000000000000000000000") {
                highestBidder = "None"
            }
            this.setState({ highestBidder })
            let auctionState = await nftMarket.methods.auctionState().call();
            this.setState({ auctionState })
            let refund = await nftMarket.methods.pendingReturns(this.state.userAccount).call()
            this.setState({ refund })
            const auctionOwn = await registry.methods.getAuction(auctionAddress).call();
            this.setState({ auctionOwner: auctionOwn[6] })

            let urlJsonAbi = await registry.methods.nftAbi(auctionOwn[2]).call();

            const resp = await fetch(urlJsonAbi);

            if (!resp.ok)
                throw new Error(response.statusText);

            const jsonAbi = await resp.json();
            const erc721Addr = new web3.eth.Contract(jsonAbi.abi, auctionOwn[2])

            this.setState({ erc721Addr })

            if (this.state.userAccount == this.state.auctionOwner) {
                this.setState({ owner: true })
            }
            const auction = await registry.methods.getAuction(auctionAddress).call();
            let nftSymbol = await registry.methods.nftSymbol(auction[2]).call();
            this.setState({ nftSymbol })
            const auctionData = await registry.methods.getNftToken(nftSymbol).call();
            let nftOwner = await erc721Addr.methods.ownerOf(1).call();
            this.setState({ nftOwner })

            const response = await fetch(auctionData[3]);

            if (!response.ok)
                throw new Error(response.statusText);

            const json = await response.json();
            this.state.metadata.push({ id: 0, name: json.name, symbol: json.symbol, description: json.description, image: json.image });

            //nuovo
            const bid = await nftMarket.methods.bids(this.state.userAccount).call();
            if (bid != null)
                this.setState({ join: true });

        } else {
            window.alert('NftMarket contract not deployed to detected network')
        }

        // Load TokenAuction
        const tokenData = AuctionToken.networks[networkId]

        if (tokenData) {
            const tokenErc20 = new web3.eth.Contract(AuctionToken.abi, tokenData.address)
            this.setState({ tokenErc20 })
            const balance = await tokenErc20.methods.balanceOf(this.state.userAccount).call()
            this.setState({ balance })

        } else {
            window.alert('Auction contract not deployed to detected network')
        }

        // Load Bid

        if (this.state.nftMarket.methods.checkBidder(this.state.userAccount).call()) {
            this.setState({ join: true })
        }

        this.getBidders()
        this.setState({ loading: false })

        // Load Refund

        this.getRefunds()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected.')
        }
    }

    async handleAuctionPrice(e) {
        e.preventDefault();
        const value = await e.target.value;
        this.setState({ bid: value });
    }

    handleAuctionForm(e) {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.state.join == false) {
            alert("You have to JOIN the Auction first!");
        } else {
            this.state.tokenErc20.methods.approve(this.state.auctionAddress, this.state.bid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
                this.state.nftMarket.methods.bid(this.state.bid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
                })
            })
            this.setState({ auctionBids: this.state.bid })
            this.setState({ loading: false })
        }
    }

    async getBidders() {
        this.setState({ loading: true })
        const size = await this.state.nftMarket.methods.biddersCount().call();
        const newArray = this.state.auctionBids.slice();

        for (var i = 0; i < size; i++) {
            let user = await this.state.nftMarket.methods.bidders(i).call();
            const result = await this.state.nftMarket.methods.bids(user).call();
            const data = ({ 'id': i, 'bidder': user, 'bidAmount': result });
            newArray.push(data);
        }
        this.setState({ auctionBids: newArray });
        this.setState({ loading: false })
    }

    async getRefunds() {
        const user = this.state.userAccount;
        const refund = await this.state.nftMarket.methods.pendingReturns(user).call();
        this.setState({ refund })
    }

    withdraw(e) {
        this.setState({ loading: true })
        this.state.tokenErc20.methods.approve(this.state.auctionAddress, this.state.refund).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.withdraw().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })
    }

    getWinBid(e) {
        this.setState({ loading: true })
        this.state.tokenErc20.methods.approve(this.state.auctionAddress, this.state.highestBid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })
        this.state.erc721Addr.methods.approve(this.state.auctionAddress, 1).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })
        this.state.erc721Addr.methods.isApprovedForAll(this.state.userAccount, this.state.highestBidder).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })
        this.state.nftMarket.methods.getWin().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })

        this.setState({ loading: false })
    }

    handleTimerOver = async () => {
        this.setState({ timer: true })
        const winner = await this.state.nftMarket.methods.highestBidder().call();
        this.setState({ highestBidder: winner })

        this.setState({ loading: true })
        const state = await this.state.nftMarket.methods.auctionState().call();
        
        if (state == 0 && this.state.highestBidder == "0x0000000000000000000000000000000000000000"){
            this.state.nftMarket.methods.closeAuction().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        }else if(state == 0){
            this.state.nftMarket.methods.endAuction().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        }
        this.setState({ loading: false })
    };

    logoutUser() {
        this.props.history.push('/');
        localStorage.clear();
    }

    getAuctions() {
        this.props.history.push('/OngoingAuctions');
    }

    myAuctions() {
        this.props.history.push('/OwnedAuctions');
    }

    homepage() {
        this.props.history.push('/NftMarketplace');
    }

    endAuction() {
        this.setState({ loading: true })
        this.state.erc721Addr.methods.approve(this.state.auctionAddress, 1).send({ from: this.state.nftOwner }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.auctionEnd(this.state.nftSymbol).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })
    }

    render() {
        let content
        if (!this.state.owner) {
            content = <div className="container" id="bidForm">
                <h3>
                    {this.state.timer ? " " : "Make your Bid!"}
                </h3>
                <BidForm
                    handleAuctionPrice={this.handleAuctionPrice}
                    handleAuctionForm={this.handleAuctionForm}
                />
            </div>
        }

        let win
        let bt
        let reward
        if (this.state.owner && this.state.timer && this.state.auctionState != 2) {
            win = <div className="card-body" id="winBody">
                <button onClick={this.getWinBid} type="button" style={{width:"200px"}} className="btn btn-success">
                    GET WIN <span class="badge badge-light">{this.state.highestBid}</span>
                </button>
            </div>

            if (this.state.owner == this.state.userAccount)
                bt = <button onClick={this.endAuction} type="submit" class="btn btn-danger"> End Auction </button>
        }

        if (this.state.userAccount == this.state.highestBidder && this.state.timer) {
            reward = <button onClick={this.getReward} type="submit" class="btn btn-success"> Get Reward </button>
        }
        return (
            <>
                <Navbar
                    address={this.state.userAccount}
                    logoutUser={this.logoutUser}
                    balance={this.state.balance}
                    getAuctions={this.getAuctions}
                    myAuctions={this.myAuctions}
                    homepage={this.homepage}
                    withdraw={this.withdraw}
                    refund={this.state.refund}
                />
                <div className="container" id="body">
                    <div className="card-body" id="winner">
                        <h3> {this.state.timer ? "WINNER : " + this.state.highestBidder : "Auction Base : " + this.state.startingBid}</h3>
                    </div>
                    
                        <div className="container" id="nftCardBody">
                            {this.state.metadata.map(nft => (
                                < Nft
                                    key={nft.id}
                                    name={nft.name}
                                    description={nft.description}
                                    image={nft.image}
                                />
                            ))}
                        </div>

                    <div className="card-body" id="end-button">
                        {bt}
                    </div>
                    <div className="p-5 mb-4 bg-light rounded-3">
                        <div className="container">
                            <div className="card-body">
                                <Timer
                                    handleTimerOver={this.handleTimerOver.bind(this)}
                                />
                            </div>
                            <div className="card-body">
                                <h2 style={{ color: 'green' }} >
                                    {this.state.timer ? "Auction End" : "Highest Bid : " + this.state.highestBid + " MCT"}
                                </h2>
                                {reward}
                            </div>
                        </div>
                    </div>
                    <ul className="list-group">
                        {this.state.auctionBids.map(bid => (
                            < Bidders
                                key={bid.id}
                                bidder={bid.bidder}
                                bidAmount={bid.bidAmount}
                            />
                        ))}
                    </ul>
                    {content}
                    {win}
                </div>
            </>
        );
    }

} export default Auction;