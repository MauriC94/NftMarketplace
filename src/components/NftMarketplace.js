import React, { Component, useReducer } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import { PropTypes } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import Navbar from "./Navbar"
import Nft from "./Nft"
import Auction from "./Auction"

import NftMarket from '../abis/NftMarket.json'
import HulkErc721 from '../abis/HulkErc721.json'
import SupermanErc721 from '../abis/SupermanErc721.json'
import DeadpoolErc721 from '../abis/DeadpoolErc721.json'

class NftMarketplace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nftMarket: '0x0',
      ercSuperman: '0x0',
      ercHulk: '0x0',
      ercDeadpool: '0x0',
      nftAuction: '',
      auctionPrice: '',
      auctionDays: '',
      auctionHours: '',
      auctionMinutes: '',
      userAccount: '0x0',
      metadata: [],
      erc721: "",
      loading: true
    }
    this.getAuctions = this.getAuctions.bind(this);
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
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const marketData = NftMarket.networks[networkId]

    const nftMarket = new web3.eth.Contract(NftMarket.abi, marketData.address)
    this.setState({ nftMarket })

    const address = localStorage.getItem('address');
    this.setState({ userAccount: address });

    const account1 = "0x138cd0dF5B11Bf9dda23f04231Bb23db225C6dC3";
    const account2 = "0x4E2E2c34d3118aCc809aD2388D4A551627d0c88c";
    const account3 = "0xCB36091327e0150c7f4D3E5e690C04CAd1C9a768";

    // Load Nft Contracts

    if (this.state.userAccount == account1) {
      const superman = SupermanErc721.networks[networkId]
      this.setState({ ercSuperman: superman.address })
      const hulk = HulkErc721.networks[networkId]
      this.setState({ ercHulk: hulk.address })
      const deadpool = DeadpoolErc721.networks[networkId]
      this.setState({ ercDeadpool: deadpool.address })


      if (superman && hulk && deadpool) {

        const sm = new web3.eth.Contract(SupermanErc721.abi, superman.address)
        const hk = new web3.eth.Contract(HulkErc721.abi, hulk.address)
        const dp = new web3.eth.Contract(DeadpoolErc721.abi, deadpool.address)

        let smURI = await sm.methods.tokenURI(1).call() // uso my-json-server per il mint

        const dpResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/0");
        const hkResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/1");
        const smResponse = await fetch("https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/2");

        if (!dpResponse.ok)
          throw new Error(dpResponse.statusText);
        if (!hkResponse.ok)
          throw new Error(hkResponse.statusText);
        if (!smResponse.ok)
          throw new Error(smResponse.statusText);

        const smJson = await smResponse.json();
        this.state.metadata.push({ id: 2, name: smJson.name, description: smJson.description, image: smJson.image });

        const hkJson = await hkResponse.json();
        this.state.metadata.push({ id: 1, name: hkJson.name, description: hkJson.description, image: hkJson.image });

        const dpJson = await dpResponse.json();
        this.state.metadata.push({ id: 0, name: dpJson.name, description: dpJson.description, image: dpJson.image });


      } else {
        window.alert('Nft contracts not deployed to detected network')
      }

    } else if (this.state.userAccount == account2) {

    } else if (this.state.userAccount == account3) {

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
    this.setState({ erc721:value });
  }

  async handleAuctionPrice(e) {
    const value = await e.target.value;
    this.setState({ auctionPrice:value });
  }

  async handleDayAuction(e) {
    const value = await e.target.value;
    this.setState({ auctionDays:value });
  }

  async handleHoursAuction(e) {
    const value = await e.target.value;
    this.setState({ auctionHours:value });
  }

  async handleMinutesAuction(e) {
    const value = await e.target.value;
    this.setState({ auctionMinutes:value });
  }

  handleAuctionForm(e) {
    e.preventDefault();
    const amount = this.state.auctionPrice;
    // tempo asta in secondi

    let daysInSeconds = this.state.auctionDays * 86400;
    let hoursInSeconds = this.state.auctionHours * 3600;
    let minutesInSeconds = this.state.auctionMinutes * 60;
    const auctionTime = daysInSeconds + hoursInSeconds + minutesInSeconds;

    // contratto NFT
    const contract = this.getNftContractAddress(this.state.erc721);
    this.startNftAuction(amount, auctionTime, contract);
  }

  startNftAuction = (amount, auctionTime, erc721) => {
    this.setState({ loading: true })
    this.state.nftMarket.methods.startAuction(amount, auctionTime, erc721).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
    })
    this.setState({ loading: false })
  }

  getNftContractAddress(name) {
    if (name == "Superman") {
      return this.state.ercSuperman;
    } else if (name == "Hulk") {
      return this.state.ercHulk;
    } else if (name == "Deadpool") {
      return this.state.ercDeadpool
    }
  }

  getAuctions = async(e) => {
    e.preventDefault();
    const auctionState = await this.state.nftMarket.methods.STATE().call()

    if(auctionState != 0)
      this.props.history.push('/OngoingAuction');
    else{
      alert("No Auction in Progress!");
    }
  };

  render() {
    let content
    if (this.state.loading) {
      content = <h4 id="loader" className="text-center">Loading ERC721 Token....</h4>
    }
    return (
      <>
        < Navbar
          address={this.state.userAccount}
          getAuctions={this.getAuctions}
        />
        <div className="container">
          <div className="row">
            {content}
            {this.state.metadata.map(nft => (
              < Nft
                key={nft.id}
                name={nft.name}
                description={nft.description}
                image={nft.image}
              />
            ))}
          </div>
          <Auction
            ercMetadata={this.state.metadata}
            handleNftChange={this.handleNftChange}
            handleAuctionPrice={this.handleAuctionPrice}
            handleDayAuction={this.handleDayAuction}
            handleHoursAuction={this.handleHoursAuction}
            handleMinutesAuction={this.handleMinutesAuction}
            handleAuctionForm={this.handleAuctionForm}
          />
        </div>
      </>
    );
  }
}

export default NftMarketplace;