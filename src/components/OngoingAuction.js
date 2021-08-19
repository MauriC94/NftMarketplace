import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Nft from './Nft'
import Timer from './Timer'

import NftMarket from '../abis/NftMarket.json'
import Auction from '../abis/AuctionToken.json'
import Bidders from './Bidders'
import BidForm from './BidForm'

import HulkErc721 from '../abis/HulkErc721.json'
import SupermanErc721 from '../abis/SupermanErc721.json'
import DeadpoolErc721 from '../abis/DeadpoolErc721.json'
import JohnWickErc721 from '../abis/JohnWickErc721.json'

class OngoingAuction extends Component {

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
        this.joinAuction = this.joinAuction.bind(this);
        this.endAuction = this.endAuction.bind(this);
        this.getBidders = this.getBidders.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
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

        // Load AuctionData

        const marketData = NftMarket.networks[networkId]
        this.setState({ contractAddress: marketData.address })
        if (marketData) {
            const nftMarket = new web3.eth.Contract(NftMarket.abi, marketData.address)
            this.setState({ nftMarket })
            let startingBid = await nftMarket.methods.startingBid().call()
            this.setState({ startingBid })
            let highestBid = await nftMarket.methods.highestBid().call()
            this.setState({ highestBid })
            let highestBidder = await nftMarket.methods.highestBidder().call()
            this.setState({ highestBidder })
            let refund = await nftMarket.methods.pendingReturns(this.state.userAccount).call()
            this.setState({ refund })
            let erc721 = await nftMarket.methods.erc721Contract().call()
            let auctionOwner = await nftMarket.methods.auction_owner().call()
            this.setState({ auctionOwner })

            if (this.state.userAccount === this.state.auctionOwner) {
                this.setState({ owner: true })
            }
            // fare il mint con il link del fetch -> improve

            if (erc721 === "0x6A9A5EcaCC11102b6668a3c6c4733f947ba63229") { // superman
                const superman = SupermanErc721.networks[networkId]
                const erc721Addr = new web3.eth.Contract(SupermanErc721.abi, superman.address)
                this.setState({ erc721Addr })
                // salvo l'owner del contratto
                let nftOwner = await erc721Addr.methods.ownerOf(1).call()
                this.setState({ nftOwner })

                const smResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/2");

                if (!smResponse.ok)
                    throw new Error(smResponse.statusText);

                const smJson = await smResponse.json();
                this.state.metadata.push({ id: 2, name: smJson.name, description: smJson.description, image: smJson.image });

            } else if (erc721 === "0x2015cE0A7De265B46E9c3B6D28277B16760A7fF1") { // hulk
                const hulk = HulkErc721.networks[networkId]
                const erc721Addr = new web3.eth.Contract(HulkErc721.abi, hulk.address)
                this.setState({ erc721Addr })
                const hkResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/1");

                if (!hkResponse.ok)
                    throw new Error(hkResponse.statusText);

                const hkJson = await hkResponse.json();
                this.state.metadata.push({ id: 2, name: hkJson.name, description: hkJson.description, image: hkJson.image });

            } else if (erc721 === "0x9624c62F134844D3f648d474Ea7Cb2b97a1Da05F") { // deadpool
                const deadpool = DeadpoolErc721.networks[networkId]
                const erc721Addr = new web3.eth.Contract(DeadpoolErc721.abi, deadpool.address)
                this.setState({ erc721Addr })
                const dpResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/0");

                if (!dpResponse.ok)
                    throw new Error(dpResponse.statusText);

                const dpJson = await dpResponse.json();
                this.state.metadata.push({ id: 0, name: dpJson.name, description: dpJson.description, image: dpJson.image });

            } else if (erc721 === "0x957E125026a9D29C9633922edf31d581D665909f") { // johnwick
                const johnwick = JohnWickErc721.networks[networkId]
                const erc721Addr = new web3.eth.Contract(JohnWickErc721.abi, johnwick.address)
                this.setState({ erc721Addr })
                const jwResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/3");

                if (!jwResponse.ok)
                    throw new Error(jwResponse.statusText);

                const jwJson = await jwResponse.json();
                this.state.metadata.push({ id: 0, name: jwJson.name, description: jwJson.description, image: jwJson.image });

            }
        } else {
            window.alert('NftMarket contract not deployed to detected network')
        }

        // Load TokenAuction
        const tokenData = Auction.networks[networkId]

        if (tokenData) {
            const tokenErc20 = new web3.eth.Contract(Auction.abi, tokenData.address)
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
            this.state.tokenErc20.methods.approve(this.state.contractAddress, this.state.bid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
                this.state.nftMarket.methods.bid(this.state.bid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
                })
            })
            this.setState({ auctionBids: this.state.bid })
            this.setState({ loading: false })
        }
    }

    async getBidders() {
        const size = await this.state.nftMarket.methods.biddersCount().call();
        const newArray = this.state.auctionBids.slice();

        for (var i = 0; i < size; i++) {
            let user = await this.state.nftMarket.methods.bidders(i).call();
            const result = await this.state.nftMarket.methods.bids(user).call();
            const data = ({ 'id': i, 'bidder': user, 'bidAmount': result });
            newArray.push(data);
        }
        this.setState({ auctionBids: newArray });
    }

    async getRefunds() {
        const user = this.state.userAccount;
        const refund = await this.state.nftMarket.methods.pendingReturns(user).call();
        this.setState({ refund })
    }

    withdraw(e) {
        this.setState({ loading: true })
        this.state.tokenErc20.methods.approve(this.state.contractAddress, this.state.refund).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.withdraw().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })
    }

    getWinBid(e) {
        this.setState({ loading: true })
        this.state.tokenErc20.methods.approve(this.state.contractAddress, this.state.highestBid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.getWin().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })

    }

    handleTimerOver = async () => {
        this.setState({ timer: true })
        const winner = await this.state.nftMarket.methods.highestBidder().call();
        this.setState({ highestBidder: winner })
    };

    joinAuction = async () => {
        this.setState({ loading: true })
        this.setState({ join: true });
        this.state.nftMarket.methods.addBidder().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })
        this.setState({ loading: false })
    };

    logoutUser() {
        this.props.history.push('/');
        localStorage.clear();
    }

    endAuction() {
        this.setState({ loading: true })
        this.state.erc721Addr.methods.approve(this.state.contractAddress, 1).send({ from: this.state.nftOwner }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.auctionEnd().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })

    }

    render() {
        let content
        if (!this.state.owner) {
            content = <div className="container">
                <div className="card-body">
                    <h3>
                        {this.state.timer ? " " : "Make your Bid!"}
                    </h3>
                </div>
                <BidForm
                    handleAuctionPrice={this.handleAuctionPrice}
                    handleAuctionForm={this.handleAuctionForm}
                />
            </div>
        }
        let win
        if (this.state.owner && this.state.timer) {
            win = <div className="container" style={{ marginTop: '20px' }}>
                <button onClick={this.getWinBid} type="button" class="btn btn-success">
                    GET WIN <span class="badge badge-light">{this.state.highestBid}</span>
                </button>
            </div>
        }
        return (
            <>
                <Navbar
                    address={this.state.userAccount}
                    logoutUser={this.logoutUser}
                    balance={this.state.balance}
                />
                <div className="container" style={{ width: '800px' }}>
                    <div className="card-body">
                        <h3> {this.state.timer ? "WINNER : " + this.state.highestBidder : "Auction Base : " + this.state.startingBid} MCT </h3>
                    </div>
                    <div className="h-100 p-5 text-black bg-dark rounded-3">
                        <div className="container" style={{ marginLeft: '220px' }}>
                            {this.state.metadata.map(nft => (
                                < Nft
                                    key={nft.id}
                                    name={nft.name}
                                    description={nft.description}
                                    image={nft.image}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="card-body">
                        {this.state.owner ? <button onClick={this.endAuction} type="submit" class="btn btn-danger"> End Auction </button> : <button onClick={this.joinAuction} type="submit" class="btn btn-info"> Join Auction </button>}
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
                    <div className="container" style={{ marginTop: '30px' }}>
                        {this.state.owner ? ' ' : <button onClick={this.withdraw} type="button" class="btn btn-success">
                            Withdraw <span class="badge badge-light">{this.state.refund}</span>
                        </button>}
                    </div>
                    <div className="card-body">
                        {win}
                    </div>
                </div>
            </>
        );
    }

} export default OngoingAuction;