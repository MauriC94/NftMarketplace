import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import Web3 from 'web3'
import Navbar from "./Navbar"
import Nft from "./Nft"
import Auction from "./Auction"

import Registry from '../abis/Registry.json'
import NftMarket from '../abis/NftMarket.json'
import AuctionToken from '../abis/AuctionToken.json'
import HulkErc721 from '../abis/HulkErc721.json'
import SupermanErc721 from '../abis/SupermanErc721.json'
import DeadpoolErc721 from '../abis/DeadpoolErc721.json'
import JohnWickErc721 from '../abis/JohnWickErc721.json'

class NftMarketplace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nftMarket: '0x0',
      nftAuction: '',
      auctionPrice: '',
      auctionDays: '',
      auctionHours: '',
      auctionMinutes: '',
      userAccount: '0x0',
      metadata: [],
      erc721Contracts: [],
      loading: true
    }
    this.logoutUser = this.logoutUser.bind(this);
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

    const registryData = Registry.networks[networkId]
    const registry = new web3.eth.Contract(Registry.abi, registryData.address)
    this.setState({ registry })

    const address = localStorage.getItem('address');
    this.setState({ userAccount: address });

    const token = AuctionToken.networks[networkId]
    const auctionToken = new web3.eth.Contract(AuctionToken.abi, token.address)
    this.setState({ auctionToken })
    
    const balance = await auctionToken.methods.balanceOf(this.state.userAccount).call()
    this.setState({ balance })

    const account1 = "0x138cd0dF5B11Bf9dda23f04231Bb23db225C6dC3";
    const account2 = "0x4E2E2c34d3118aCc809aD2388D4A551627d0c88c";
    const account3 = "0xCB36091327e0150c7f4D3E5e690C04CAd1C9a768";

    // Load Nft Contracts

    const superman = SupermanErc721.networks[networkId]
    this.setState({ ercSuperman: superman.address })
    const hulk = HulkErc721.networks[networkId]
    this.setState({ ercHulk: hulk.address })
    const deadpool = DeadpoolErc721.networks[networkId]
    this.setState({ ercDeadpool: deadpool.address })
    const johnwick = JohnWickErc721.networks[networkId]
    this.setState({ ercJohnWick: johnwick.address })

    // per ogni contratto guardo il proprietario

    const sm = new web3.eth.Contract(SupermanErc721.abi, superman.address);
    const hk = new web3.eth.Contract(HulkErc721.abi, hulk.address);
    const dp = new web3.eth.Contract(DeadpoolErc721.abi, deadpool.address);
    const jw = new web3.eth.Contract(JohnWickErc721.abi, johnwick.address);

    const smId = await sm.methods.getTokenId().call();
    this.setState({ smId })
    const hkId = await hk.methods.getTokenId().call();
    this.setState({ hkId })
    const dpId = await dp.methods.getTokenId().call();
    this.setState({ dpId })
    const jwId = await jw.methods.getTokenId().call();
    this.setState({ jwId })

    const smOwner = await sm.methods.ownerOf(smId).call();
    const hkOwner = await hk.methods.ownerOf(hkId).call();
    const dpOwner = await dp.methods.ownerOf(dpId).call();
    const jwOwner = await jw.methods.ownerOf(jwId).call();

    const erc721Map = new Map()

    this.setValue(erc721Map, smOwner, this.state.ercSuperman);
    this.setValue(erc721Map, hkOwner, this.state.ercHulk);
    this.setValue(erc721Map, dpOwner, this.state.ercDeadpool);
    this.setValue(erc721Map, jwOwner, this.state.ercJohnWick);

    this.setState({ erc721Map })
    const set = this.state.erc721Map.get(this.state.userAccount);

    if (set) {
      const iterator = set.values()

      if (this.state.userAccount == account1) {

        for (var i = 0; i < set.size; i++) {
          const addr = iterator.next().value;
          this.getUri(addr);
          const response = await fetch(this.state.json);

          if (!response.ok)
            throw new Error(response.statusText);

          const json = await response.json();

          this.state.metadata.push({ id: i, name: json.name, description: json.description, image: json.image });
        }

      } else if (this.state.userAccount == account2) {

        for (var i = 0; i < set.size; i++) {
          const addr = iterator.next().value;
          this.getUri(addr);
          const response = await fetch(this.state.json);

          if (!response.ok)
            throw new Error(response.statusText);

          const json = await response.json();
          this.state.metadata.push({ id: i, name: json.name, description: json.description, image: json.image });
        }

      } else if (this.state.userAccount == account3) {

        for (var i = 0; i < set.size; i++) {
          const addr = iterator.next().value;
          this.getUri(addr);
          const response = await fetch(this.state.json);

          if (!response.ok)
            throw new Error(response.statusText);

          const json = await response.json();
          this.state.metadata.push({ id: i, name: json.name, description: json.description, image: json.image });
        }

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
    this.setState({ erc721: value });
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

  setValue(map, key, value) {
    if (!map.has(key)) {
      const erc721 = new Set();
      erc721.add(value);
      map.set(key, erc721);
      return;
    }
    map.get(key).add(value);
  }

  getUri = async (addr) => {

    if (addr == "0x6A9A5EcaCC11102b6668a3c6c4733f947ba63229") { // superman
      const json = "https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/2";
      this.setState({ json })

    } else if (addr == "0x2015cE0A7De265B46E9c3B6D28277B16760A7fF1") { // hulk
      const json = "https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/1";
      this.setState({ json });

    } else if (addr == "0x9624c62F134844D3f648d474Ea7Cb2b97a1Da05F") { // deadpool
      const json = "https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/0";
      this.setState({ json });

    } else if (addr == "0x957E125026a9D29C9633922edf31d581D665909f") { // john wick
      const json = "https://my-json-server.typicode.com/MauriC94/NftMarketplace/tokens/3";
      this.setState({ json });
    }
  };

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
    const tokenId = 1;
    this.startNftAuction(amount, auctionTime, contract, tokenId);
  }

  startNftAuction = (amount, auctionTime, erc721, id) => {
    this.setState({ loading: true })
    this.state.nftMarket.methods.startAuction(amount, auctionTime, erc721, id).send({ from: this.state.userAccount }).on('transactionHash', (hash) => {
    })
    this.setState({ loading: false })
  }

  getNftContractAddress(name) {
    if (name === "Superman") {
      return this.state.ercSuperman;
    } else if (name === "Hulk") {
      return this.state.ercHulk;
    } else if (name === "Deadpool") {
      return this.state.ercDeadpool
    } else if (name === "JohnWick") {
      return this.state.ercJohnWick
    }
  }

  getAuctions = async (e) => {
    e.preventDefault();
    const auctionState = await this.state.nftMarket.methods.STATE().call()

    if (auctionState == 1)
      this.props.history.push('/OngoingAuction');
    else {
      alert("No Auction in Progress!");
    }
  };

  logoutUser() {
    this.props.history.push('/');
    localStorage.clear();
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
          getAuctions={this.getAuctions}
          logoutUser={this.logoutUser}
          balance={this.state.balance}
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
          <div className="card-body">
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
        </div>
      </>
    );
  }
}

export default NftMarketplace;