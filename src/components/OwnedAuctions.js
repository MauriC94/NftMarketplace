import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from "./Navbar"

import AuctionElement from './AuctionElement'
import Registry from '../abis/Registry.json'
import NftMarket from '../abis/NftMarket.json'
import AuctionToken from '../abis/AuctionToken.json'

import './OwnedAuction.css';

class OwndedAuctions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAccount: '0x0',
            auctionData: [],
            loading: true
        }
        this.getAuctions = this.getAuctions.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
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

        const token = AuctionToken.networks[networkId]
        const auctionToken = new web3.eth.Contract(AuctionToken.abi, token.address)
        const balance = await auctionToken.methods.balanceOf(this.state.userAccount).call()
        this.setState({ balance })

        const size = await registry.methods.contractCreated().call();

        for (var i = 0; i < size; i++) {
            const auctionData = await registry.methods.allAuctions(i).call();
            let nftMarket = new web3.eth.Contract(NftMarket.abi, auctionData);
            const auctions = await registry.methods.getAuction(auctionData).call();
            let owner = auctions[6];
            let nftState = await nftMarket.methods.nftState().call();
            let auctionState = await nftMarket.methods.auctionState().call();
            const nftSymbol = await registry.methods.nftSymbol(auctions[2]).call();
            const nftData = await registry.methods.getNftToken(nftSymbol).call();

            const uri = nftData[3];
            const response = await fetch(uri);

            if (!response.ok)
                throw new Error(response.statusText);

            const json = await response.json();

            console.log(auctionState)

            // verifico se proprietario dell'asta
            if (owner == this.state.userAccount && nftState != 1 && auctionState != 2) {
                this.state.auctionData.push({ id: i, name: json.name, symbol: json.symbol, description: json.description, image: json.image, amount: auctions[0], time: auctions[1], auction: auctions[5] });
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

    getAuctions = async (e) => {
        this.props.history.push('/OngoingAuctions');
    };

    withdraw(e) {
        this.setState({ loading: true })
        this.state.tokenErc20.methods.approve(this.state.auctionAddress, this.state.refund).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            this.state.nftMarket.methods.withdraw().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
            })
        })
        this.setState({ loading: false })
    }

    joinAuction = async (auction) => {
        localStorage.setItem('auction', auction);
        this.props.history.push('/Auction');
    }

    logoutUser() {
        this.props.history.push('/');
        localStorage.clear();
    }

    render() {
        return (
            <>
                < Navbar
                    address={this.state.userAccount}
                    myAuctions={this.myAuctions}
                    getAuctions={this.getAuctions}
                    logoutUser={this.logoutUser}
                    withdraw={this.withdraw}
                    balance={this.state.balance}
                />
                <div className="card-body">
                    <h1 className="display-4 fw-normal">My Auctions</h1>
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
} export default OwndedAuctions;