import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import { PropTypes } from 'react'
import Web3 from 'web3'
import Navbar from "./Navbar"
import Nft from "../components/Nft"
import Auction from "./Auction"

import HulkErc721 from '../abis/HulkErc721.json'
import SupermanErc721 from '../abis/SupermanErc721.json'
import DeadpoolErc721 from '../abis/DeadpoolErc721.json'

class NftMarket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nftAuction: '',
      auctionPrice: '',
      auctionDays: '',
      auctionHours: '',
      auctionMinutes: '',
      userAccount: '0x0',
      metadata: [],
      loading: true
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    console.log(networkId)

    const address = localStorage.getItem('address');
    this.setState({ userAccount: address });
    console.log(this.state.userAccount)

    const account1 = "0x138cd0dF5B11Bf9dda23f04231Bb23db225C6dC3";
    const account2 = "0x4E2E2c34d3118aCc809aD2388D4A551627d0c88c";
    const account3 = "0xCB36091327e0150c7f4D3E5e690C04CAd1C9a768";

    // Load Nft Contracts

    if (this.state.userAccount == account1) {
      const superman = SupermanErc721.networks[networkId]
      const hulk = HulkErc721.networks[networkId]
      const deadpool = DeadpoolErc721.networks[networkId]

      if (superman && hulk && deadpool) {

        const sm = new web3.eth.Contract(SupermanErc721.abi, superman.address)
        const hk = new web3.eth.Contract(HulkErc721.abi, hulk.address)
        const dp = new web3.eth.Contract(DeadpoolErc721.abi, deadpool.address)

        let smURI = await sm.methods.tokenURI(1).call()
        let hkURI = await hk.methods.tokenURI(1).call()
        let dpURI = await dp.methods.tokenURI(1).call()

        const smResponse = await fetch(hkURI);
        //const hkResponse = await fetch(hkURI);
        //const dpResponse = await fetch(dpURI);

        if (!smResponse.ok)
          throw new Error(smResponse.statusText);


        const smJson = await smResponse.json();
        this.state.metadata.push({ id: 0, name: smJson.name, description: smJson.description, image: smJson.image });

        //const hkJson = await hkResponse.json();
        //this.state.metadata.push({ id: 1, name: hkJson.name, description: hkJson.description, image: hkJson.image });

        //const dpJson = await dpResponse.json();
        //this.state.metadata.push({ id: 2, name: dpJson.name, description: dpJson.description, image: dpJson.image });


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

  handleNftChange(e) {
    this.setState({ nftAuction: e.target.value });
  }

  handleAuctionPrice(e) {
    this.setState({ auctionPrice: e.target.value });
  }

  handleDayAuction(e) {
    this.setState({ auctionDays: e.target.value });
  }

  handleHoursAuction(e) {
    this.setState({ auctionHours: e.target.value });
  }

  handleMinutesAuction(e) {
    this.setState({ auctionMinutes: e.target.value });
  }

  handleAuctionForm(e) {
    e.preventDefault();

  }

  render() {
    let content
    if (this.state.loading) {
      content = <h4 id="loader" className="text-center">Loading ERC721 Token....</h4>
    }
    return (
      <>
        < Navbar address={this.state.userAccount} />
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
      </>
    );
  }
}

export default NftMarket;