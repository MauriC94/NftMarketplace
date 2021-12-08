import React, { Component, useState } from 'react'
import Web3 from 'web3'
import Registry from '../abis/Registry.json'
import AuctionElement from './AuctionElement'
import AuctionToken from '../abis/AuctionToken.json'
import Navbar from './Navbar'
import NftMarket from '../abis/NftMarket.json'

import './OwnedAuction.css';

class OngoingAuctions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAccount: '0x0',
            auctionContracts: [],
            auctionData: [],
            loading: true
        }
        this.logoutUser = this.logoutUser.bind(this);
        this.myAuctions = this.myAuctions.bind(this);
        this.rewards = this.rewards.bind(this);
        this.homepage = this.homepage.bind(this);
    }

    async componentDidMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()

        // Load Data
        const address = localStorage.getItem('address');
        this.setState({ userAccount: address });

        // Load Auctions
        const registryData = Registry.networks[networkId]
        const registry = new web3.eth.Contract(Registry.abi, registryData.address)
        this.setState({ registry })

        const username = await registry.methods.userName(address).call();
        this.setState({ username })

        const datetime = ((new Date()).toLocaleDateString());
        this.setState({datetime})

        const token = AuctionToken.networks[networkId]
        const auctionToken = new web3.eth.Contract(AuctionToken.abi, token.address)
        const balance = await auctionToken.methods.balanceOf(this.state.userAccount).call()
        this.setState({ balance })

        const size = await registry.methods.contractCreated().call();

        for (var i = 0; i < size; i++) {
            const auctionData = await registry.methods.allAuctions(i).call();
            let nftMarket = new web3.eth.Contract(NftMarket.abi, auctionData);
            let highestBidder = await nftMarket.methods.highestBidder().call();
            const auctions = await registry.methods.getAuction(auctionData).call();
            let owner = auctions[6];
            let state = await nftMarket.methods.auctionState().call();
            const nftSymbol = await registry.methods.nftSymbol(auctions[3]).call();
            const nftData = await registry.methods.getNftToken(nftSymbol).call();

            const uri = nftData[3];
            const response = await fetch(uri);

            if (!response.ok)
                throw new Error(response.statusText);

            const json = await response.json();

            // verifico se in corso
            if (state == 0 && owner != this.state.userAccount || state == 1 && owner == highestBidder) {
                this.state.auctionData.push({ id: i, name: json.name, symbol: json.symbol, description: json.description, image: json.image, amount: auctions[0], time: auctions[2], auction: auctions[5] });
            }
        }
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

    joinAuction = async (auction) => {
        localStorage.setItem('auction', auction);
        this.props.history.push('/Auction');
    }

    myAuctions() {
        this.props.history.push('/OwnedAuctions');
    }

    homepage() {
        this.props.history.push('/NftMarketplace');
    }

    logoutUser() {
        this.props.history.push('/');
        localStorage.clear();
    }

    rewards() {
        this.props.history.push('/Reward');
    }

    render() {
        return (
            <>
                < Navbar
                    address={this.state.userAccount}
                    username={this.state.username}
                    getAuctions={this.getAuctions}
                    myAuctions={this.myAuctions}
                    homepage={this.homepage}
                    rewards={this.rewards}
                    logoutUser={this.logoutUser}
                    balance={this.state.balance}
                    datetime={this.state.datetime}
                />
                <div className="card-body">
                    <h1 className="display-4 fw-normal">Auctions in Progress</h1>
                </div>
                <div className="container" style={{ marginTop: "40px" }}>
                    <div className="row">
                        {this.state.auctionData.map(data => (
                            <AuctionElement
                                id={data.id}
                                name={data.name}
                                description={data.description}
                                symbol={data.symbol}
                                image={data.image}
                                amount={data.amount}
                                time={data.time}
                                auction={data.auction}
                                joinAuction={this.joinAuction}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    }

} export default OngoingAuctions;

