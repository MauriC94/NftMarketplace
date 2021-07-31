import React, { Component, useState } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Nft from './Nft'
import CountdownTimer from './CountdownTimer'
import Timer from './Timer'

import NftMarket from '../abis/NftMarket.json'
import Auction from '../abis/AuctionToken.json'
import NftMarketplace from './NftMarketplace'
import Bidders from './Bidders'
import BidForm from './BidForm'

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
        this.joinAuction = this.joinAuction.bind(this);
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
            let count = await nftMarket.methods.bidsCounter().call()
            this.setState({ count })
            let refund = await nftMarket.methods.pendingReturns(this.state.userAccount).call()
            this.setState({ refund })
            let auctionOwner = await nftMarket.methods.auction_owner().call()
            this.setState({ auctionOwner })
            let erc721 = await nftMarket.methods.erc721Contract().call()
            

            if (erc721 === "0xe9DD4C346A1f06b9782e89b5B7F9EF2e5a81F3e6") { // superman
                const smResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/2");

                if (!smResponse.ok)
                    throw new Error(smResponse.statusText);

                const smJson = await smResponse.json();
                this.state.metadata.push({ id: 2, name: smJson.name, description: smJson.description, image: smJson.image });


            } else if (erc721 === "0x2abf116b6283aE25Ef7b501be4E697DcE52D58de") { // hulk
                const hkResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/1");

            } else if (erc721 === "0x69d0b79EA7C2061eb3Cd4f86224d8289bc47fF21") { // deadpool
                const dpResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/0");

                if (!dpResponse.ok)
                    throw new Error(dpResponse.statusText);

                const dpJson = await dpResponse.json();
                this.state.metadata.push({ id: 0, name: dpJson.name, description: dpJson.description, image: dpJson.image });

            }
        } else {
            window.alert('NftMarket contract not deployed to detected network')
        }

        // Load TokenAuction

        const tokenData = Auction.networks[networkId]

        if (tokenData) {
            const tokenErc20 = new web3.eth.Contract(Auction.abi, tokenData.address)
            this.setState({ tokenErc20 })

        } else {
            window.alert('Auction contract not deployed to detected network')
        }

        // Load Bid

        const result = await this.state.nftMarket.methods.bids(this.state.userAccount).call();
        const size = this.state.count;
        const newArray = this.state.auctionBids.slice();

        const data = ({ 'id': 0, 'bidder': this.state.userAccount, 'bidAmount': result });
        newArray.push(data);

        this.setState({ auctionBids: newArray });
        this.setState({ loading: false })
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
        if(this.state.join == false){
            alert("You have to JOIN the Auction first!");
        }else{
            this.state.tokenErc20.methods.approve(this.state.contractAddress, this.state.bid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
                this.state.nftMarket.methods.bid(this.state.bid).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
                })
            })
            this.setState({ loading: false })
            this.setState({ auctionBids: this.state.bid })
        }
    }

    getBidders = async () => {
        const usersJoined = await this.state.nftMarket.methods.bidders().call();
        const size = await this.state.nftMarket.methods.biddersCount().call();
        const newArray = this.state.auctionBids.slice();

        for(var i=0; i<size; i++){
            let user = usersJoined[i];
            const result = await this.state.nftMarket.methods.bids(user).call();
            const data = ({ 'id': i, 'bidder': user, 'bidAmount': result });
            newArray.push(data);
        } 
        this.setState({ auctionBids: newArray });
    };

    withdraw(e) {
        this.setState({ loading: true })
        this.state.tokenErc20.methods.approve(this.state.contractAddress, this.state.refund).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.withdraw().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })
    }

    handleTimerOver = async() => {
        this.setState({ timer: true })

        const winner = await this.state.nftMarket.methods.highestBidder().call();
        this.setState({ highestBidder:winner })
        /*
        this.setState({ loading: true })
        this.state.nftMarket.methods.resetAuction().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })
        this.setState({ loading: false })
        */
    };

    joinAuction = async() => {
        this.setState({ join:true });

        this.setState({ loading:true })
        this.state.nftMarket.methods.addBidder().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        this.setState({ loading:false })
    };

    /*
    endAuction = async() => {
        this.setState({ loading:true })
        this.state.nftMarket.methods.().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        })
        this.setState({ loading:false})

    };
    */

    render() {
        let content
        if (this.state.loading) {
            content = <h4 id="loader" className="text-center">Loading ERC721 Token....</h4>
        }
        if(this.state.userAccount == this.state.auctionOwner){
            this.setState({ owner:true })
        }
        return (
            <>
                <Navbar
                    address={this.state.userAccount}
                />
                <div className="container" style={{ width: '600px' }}>
                    <h4> {this.state.timer ? "WINNER : " + this.state.highestBidder : "Auction Base : " + this.state.startingBid} MCT </h4>
                    <div className="row">
                        {this.state.metadata.map(nft => (
                            < Nft
                                key={nft.id}
                                name={nft.name}
                                description={nft.description}
                                image={nft.image}
                            />
                        ))}
                    </div>
                    {this.state.owner ? <button onClick={this.joinAuction} type="submit" class="btn btn-primary"> Join Auction </button> : <button onClick={this.endAuction} type="submit" class="btn btn-danger"> End Auction </button> }
                    <div className="container">
                        <div className="card-body">
                            <Timer
                                handleTimerOver={this.handleTimerOver.bind(this)}
                            />
                        </div>
                        <h2 style={{ color: 'green' }} >
                            {this.state.timer ? "Auction End" : "Highest Bid : " + this.state.highestBid}
                        </h2>
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
                    <div className="container">
                        <h3>
                            {this.state.timer ? " " : "Make your Bid!"}
                        </h3>
                        <BidForm
                            handleAuctionPrice={this.handleAuctionPrice}
                            handleAuctionForm={this.handleAuctionForm}
                        />
                    </div>
                    <div className="container" style={{ marginTop: '30px' }}>
                        <button onClick={this.withdraw} type="submit" class="btn btn-success">Withdraw</button>
                    </div>
                </div>
            </>
        );
    }

} export default OngoingAuction;