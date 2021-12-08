import React, { Component } from 'react'
import Web3 from 'web3'
import Registry from '../abis/Registry.json'
import NftReward from './NftReward'
import Navbar from './Navbar'
import NftMarket from '../abis/NftMarket.json'
import AuctionToken from '../abis/AuctionToken.json'

import AuctionNftEnded from './AuctionNftEnded'

class AuctionHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAccount: '0x0',
            auctionData: [],
            loading: true
        }
        this.logoutUser = this.logoutUser.bind(this);
        this.viewAuction = this.viewAuction.bind(this);
    }

    async componentDidMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = window.web3
        this.setState({ web3 })
        const networkId = await web3.eth.net.getId();

        const address = localStorage.getItem('address');
        this.setState({ userAccount: address });

        const registryData = Registry.networks[networkId]
        const registry = new web3.eth.Contract(Registry.abi, registryData.address)
        this.setState({ registry })

        const username = await registry.methods.userName(address).call();
        this.setState({ username })

        const datetime = ((new Date()).toLocaleDateString());
        this.setState({ datetime })

        const token = AuctionToken.networks[networkId]
        const auctionToken = new web3.eth.Contract(AuctionToken.abi, token.address)
        this.setState({ auctionToken: token.address })

        const balance = await auctionToken.methods.balanceOf(this.state.userAccount).call()
        this.setState({ balance })

        const size = await registry.methods.contractCreated().call();

        for (var i = 0; i < size; i++) {
            const auctionData = await registry.methods.allAuctions(i).call();
            const nftMarket = new web3.eth.Contract(NftMarket.abi, auctionData);
            this.setState({ nftMarket })
            const auctions = await registry.methods.getAuction(auctionData).call();
            let auctionState = await nftMarket.methods.auctionState().call();
            let nftState = await nftMarket.methods.nftState().call();
            let highestBidder = await nftMarket.methods.highestBidder().call();
            let userNameWinner = await registry.methods.userName(highestBidder).call();
            const timestamp = auctions[1]/1000;
            const auctionDate = new Date(timestamp*1000).toLocaleDateString();
            let highestBid = await nftMarket.methods.highestBid().call();
            const nftSymbol = await registry.methods.nftSymbol(auctions[3]).call();
            const nftData = await registry.methods.getNftToken(nftSymbol).call();

            const uri = nftData[3];
            const response = await fetch(uri);

            if (!response.ok)
                throw new Error(response.statusText);

            const json = await response.json();

            if (auctionState == 2 && nftState == 2) {
                this.state.auctionData.push({ id: i, name: json.name, symbol: json.symbol, description: json.description, image: json.image, winner: userNameWinner, price: highestBid, winnerAddress: highestBidder, datetime: auctionDate });
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

    logoutUser() {
        this.props.history.push('/');
        localStorage.clear();
    }

    async viewAuction(symbol) {
        const data = await this.state.registry.methods.getNftToken(symbol).call();
        const erc721 = data[0];
        const auctionAddress = await this.state.registry.methods.nftAuction(erc721).call();
        localStorage.setItem('auction', auctionAddress);
        this.props.history.push('/AuctionView');
    }

    render() {
        return (
            <>
                < Navbar
                    address={this.state.userAccount}
                    username={this.state.username}
                    datetime={this.state.datetime}
                    getAuctions={this.getAuctions}
                    myAuctions={this.myAuctions}
                    homepage={this.homepage}
                    logoutUser={this.logoutUser}
                    balance={this.state.balance}
                />
                <div className="card-body">
                    <h1 className="display-4 fw-normal">Auction History</h1>
                </div>
                <div className="container" style={{ marginTop: "40px" }}>

                    <div className="row">
                        {this.state.auctionData.map(data => (
                            <AuctionNftEnded
                                key={data.key}
                                name={data.name}
                                description={data.description}
                                symbol={data.symbol}
                                image={data.image}
                                winner={data.winner}
                                winnerAddress={data.winnerAddress}
                                price={data.price}
                                datetime={data.datetime}
                                viewAuction={this.viewAuction}
                                address={this.state.userAccount}
                            />
                        ))}

                    </div>
                </div>
            </>
        );
    }
} export default AuctionHistory;