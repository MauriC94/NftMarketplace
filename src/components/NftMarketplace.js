import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import Web3 from 'web3'
import Navbar from "./Navbar"
import Nft from "./Nft"
import AuctionForm from "./AuctionForm"

import './NftMarketplace.css';

import NftMarket from '../abis/NftMarket.json'
import Registry from '../abis/Registry.json'
import AuctionToken from '../abis/AuctionToken.json'

class NftMarketplace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nftMarket: '0x0',
      nftAuction: '',
      auctionToken: '0x0',
      auctionPrice: '',
      auctionDays: '',
      auctionHours: '',
      auctionMinutes: '',
      userAccount: '0x0',
      metadata: [],
      loading: true
    }
    this.logoutUser = this.logoutUser.bind(this);
    this.getAuctions = this.getAuctions.bind(this);
    this.myAuctions = this.myAuctions.bind(this);
    this.rewards = this.rewards.bind(this);
    this.handleAuctionPrice = this.handleAuctionPrice.bind(this);
    this.handleNftChange = this.handleNftChange.bind(this);
    this.handleDayAuction = this.handleDayAuction.bind(this);
    this.handleHoursAuction = this.handleHoursAuction.bind(this);
    this.handleMinutesAuction = this.handleMinutesAuction.bind(this);
    this.handleAuctionForm = this.handleAuctionForm.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainNftData()
  }

  async loadBlockchainNftData() {
    const address = localStorage.getItem('address');
    this.setState({ userAccount: address });

    const web3 = window.web3
    this.setState({ web3 })
    const networkId = await web3.eth.net.getId()

    const registryData = Registry.networks[networkId]
    const registry = new web3.eth.Contract(Registry.abi, registryData.address)
    this.setState({ registry })

    const username = await registry.methods.userName(address).call();
    this.setState({ username })

    const datetime = ((new Date()).toLocaleDateString());
    this.setState({datetime})

    const tokenData = AuctionToken.networks[networkId]
    const tokenErc20 = new web3.eth.Contract(AuctionToken.abi, tokenData.address)
    this.setState({ tokenErc20 })

    const size = await registry.methods.contractCreated().call();
    var refund = 0;

    for (var i = 0; i < size; i++) {
      const auctionData = await registry.methods.allAuctions(i).call();
      this.setState({ auctionData });
    }
    this.setState({ refund });

    const token = AuctionToken.networks[networkId]
    const auctionToken = new web3.eth.Contract(AuctionToken.abi, token.address)
    this.setState({ auctionToken: token.address })

    const balance = await auctionToken.methods.balanceOf(this.state.userAccount).call()
    this.setState({ balance })

    const nftAddress = await this.state.registry.methods.getNftArray().call();

    for (var i = 0; i < nftAddress.length; i++) {
      const symbol = await this.state.registry.methods.nftSymbol(nftAddress[i]).call();
      const auctionAddress = await this.state.registry.methods.nftAuction(nftAddress[i]).call();
      let nftState = 0;
      if (auctionAddress != "0x0000000000000000000000000000000000000000") {
        const nftMarket = new web3.eth.Contract(NftMarket.abi, auctionAddress);
        nftState = await nftMarket.methods.nftState().call();
      }

      const nft = await this.state.registry.methods.getNftToken(symbol).call();
      const abi = nft[2];
      const uri = nft[3];
      const abiResp = await fetch(abi);
      const uriResp = await fetch(uri);

      if (!abiResp.ok)
        throw new Error(abiResp.statusText);

      if (!uriResp.ok)
        throw new Error(uriResp.statusText);

      const jsonAbi = await abiResp.json();
      const jsonUri = await uriResp.json();
      const erc721Addr = new web3.eth.Contract(jsonAbi.abi, nft[0]);
      const nftOwner = await erc721Addr.methods.ownerOf(nft[1]).call();

      if (nftOwner == this.state.userAccount && nftState != 1) {
        this.state.metadata.push({ id: i, name: jsonUri.name, symbol: jsonUri.symbol, description: jsonUri.description, image: jsonUri.image });
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

  async handleNftChange(e) {
    const value = await e.target.value;
    this.setState({ erc721Symbol: value });
  }

  async handleAuctionPrice(e) {
    const value = await e.target.value;
    this.setState({ auctionPrice: value });
  }

  async handleDayAuction(e) {
    const value = await e.target.value;
    this.setState({ auctionDays: value });
  }

  async handleHoursAuction(e) {
    const value = await e.target.value;
    this.setState({ auctionHours: value });
  }

  async handleMinutesAuction(e) {
    const value = await e.target.value;
    this.setState({ auctionMinutes: value });
  }

  async getTokenAddress(symbol) {
    const nft = await this.state.registry.methods.getNftToken(symbol).call();
    const abi = nft[2];
    const abiResp = await fetch(abi);

    if (!abiResp.ok)
      throw new Error(abiResp.statusText);

    const jsonAbi = await abiResp.json();
    const erc721Addr = new this.state.web3.eth.Contract(jsonAbi.abi, nft[0]);
    return erc721Addr;
  }

  async handleAuctionForm(e) {
    e.preventDefault();
    const amount = this.state.auctionPrice;
    // data
    const date = new Date().getTime();
    
    // tempo asta in secondi
    let daysInSeconds = this.state.auctionDays * 86400;
    let hoursInSeconds = this.state.auctionHours * 3600;
    let minutesInSeconds = this.state.auctionMinutes * 60;
    const auctionTime = daysInSeconds + hoursInSeconds + minutesInSeconds;

    // Token
    const tokenContract = this.state.auctionToken;

    // contratto NFT
    const nftData = await this.state.registry.methods.getNftToken(this.state.erc721Symbol).call()
    const tokenId = 1;

    this.startNftAuction(amount,date,auctionTime,nftData[0],tokenContract,tokenId);
  }

  startNftAuction = async (amount,date,auctionTime, erc721, erc20, id) => {
    this.setState({ loading: true })
    const erc721Address = await this.getTokenAddress(this.state.erc721Symbol);
    await this.state.registry.methods.createAuction(amount,date,auctionTime,erc721,erc20,id).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {

    })
    const i = await this.state.registry.methods.contractCreated().call();
    const contractAddress = await this.state.registry.methods.allAuctions(i - 1).call();
    erc721Address.methods.approve(contractAddress, 1).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
    })
    this.setState({ loading: false })
  }

  getAuctions = async (e) => {
    this.props.history.push('/OngoingAuctions');
  };

  myAuctions() {
    this.props.history.push('/OwnedAuctions');
  }

  logoutUser() {
    this.props.history.push('/');
    localStorage.clear();
  }

  rewards() {
    this.props.history.push('/Reward');
  }

  render() {
    let content
    if (this.state.loading) {
      content = <h4 id="loader" className="text-center"> Loading ERC721 Token.... </h4>
    }
    return (
      <>
        < Navbar
          address={this.state.userAccount}
          username={this.state.username}
          getAuctions={this.getAuctions}
          rewards={this.rewards}
          myAuctions={this.myAuctions}
          logoutUser={this.logoutUser}
          balance={this.state.balance}
          datetime={this.state.datetime}
          refund={this.state.refund}
        />
        <div className="card-body" id="nftMarket">
          <h1 className="display-4 fw-normal">NFT Market</h1>
        </div>
        <div className="container">
          {content}
          <div className="row">
            {this.state.metadata.map(nft => (
              < Nft
                key={nft.key}
                name={nft.name}
                symbol={nft.symbol}
                description={nft.description}
                image={nft.image}
              />

            ))}
          </div>
        </div>
        <AuctionForm
          ercMetadata={this.state.metadata}
          handleNftChange={this.handleNftChange}
          handleAuctionPrice={this.handleAuctionPrice}
          handleDayAuction={this.handleDayAuction}
          handleHoursAuction={this.handleHoursAuction}
          handleMinutesAuction={this.handleMinutesAuction}
          handleAuctionForm={this.handleAuctionForm}
        />
      </>
    );
  }
}

export default NftMarketplace;