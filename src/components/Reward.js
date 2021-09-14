import React, { Component } from 'react'
import Web3 from 'web3'
import Registry from '../abis/Registry.json'
import NftReward from './NftReward'
import Navbar from './Navbar'
import NftMarket from '../abis/NftMarket.json'
import AuctionToken from '../abis/AuctionToken.json'
import './OwnedAuction.css';

class Reward extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAccount: '0x0',
            auctionData: [],
            loading: true
        }
        this.logoutUser = this.logoutUser.bind(this);
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
            let highestBidder = await nftMarket.methods.highestBidder().call();
            const auctions = await registry.methods.getAuction(auctionData).call();
            let owner = auctions[6];
            let auctionState = await nftMarket.methods.auctionState().call();
            let nftState = await nftMarket.methods.nftState().call();
            const highestBid = await nftMarket.methods.highestBid().call();
            const nftSymbol = await registry.methods.nftSymbol(auctions[2]).call();
            const nftData = await registry.methods.getNftToken(nftSymbol).call();

            const uri = nftData[3];
            const response = await fetch(uri);

            if (!response.ok)
                throw new Error(response.statusText);

            const json = await response.json();

            if (auctionState == 2 && this.state.userAccount == highestBidder && nftState == 0) {
                this.state.auctionData.push({ id: i, name: json.name, symbol: json.symbol, description: json.description, image: json.image, price: highestBid, time: auctions[1], auction: auctions[5] });
            }

        }
        this.setState({ loading: false })
    }

    getReward = async (auction) => {
        const auctionOwn = await this.state.registry.methods.getAuction(auction).call();

        let urlJsonAbi = await this.state.registry.methods.nftAbi(auctionOwn[2]).call();

        const resp = await fetch(urlJsonAbi);

        if (!resp.ok)
            throw new Error(resp.statusText);

        const jsonAbi = await resp.json();
        const erc721Addr = new this.state.web3.eth.Contract(jsonAbi.abi, auctionOwn[2])
        const nftOwner = await erc721Addr.methods.ownerOf(1).call();

        this.setState({ loading: true })

        this.state.nftMarket.methods.getReward().send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
        });
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

    render() {
        return (
            <>
                < Navbar
                    address={this.state.userAccount}
                    getAuctions={this.getAuctions}
                    myAuctions={this.myAuctions}
                    homepage={this.homepage}
                    logoutUser={this.logoutUser}
                    balance={this.state.balance}
                />
                <div className="card-body">
                    <h1 className="display-4 fw-normal">Get your NFT</h1>
                </div>
                <div className="container" style={{ marginTop: "40px" }}>

                    {this.state.auctionData.map(data => (
                        <div className="row" key={data.id}>
                            <NftReward
                                name={data.name}
                                description={data.description}
                                symbol={data.symbol}
                                image={data.image}
                                amount={data.amount}
                                auction={data.auction}
                                getReward={this.getReward}
                            />

                        </div>
                    ))}
                </div>
            </>
        );
    }
} export default Reward;