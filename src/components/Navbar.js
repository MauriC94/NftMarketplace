import React, { Component } from 'react'
import Web3 from 'web3'
import { Link } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

class Navbar extends Component {

  async componentDidMount() {
    await this.loadWeb3()
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

  logout(event) {
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" style={{ color: 'orange' }} data-tip={this.props.address} > User : {this.props.username}</a>
          <ReactTooltip place="top" type="dark" effect="float" />
          <a className="navbar-brand" style={{ color: 'orange' }}> Balance : {this.props.balance} MCT</a>
          <a className="navbar-brand" style={{ color: 'green' }}> Datetime : {this.props.datetime} </a>
          <ul class="navbar-nav mr-auto">
            <li><Link to='/NftMarketplace' style={{ color: 'white' }} >Home</Link></li>
          </ul>
          <ul className="navbar-nav mr-auto">
            <li><Link to='/OwnedAuctions' style={{ color: 'white' }} >My Auctions</Link></li>
          </ul>
          <ul className="navbar-nav mr-auto">
            <li><Link to='/OngoingAuctions' style={{ color: 'white' }} >Ongoing Auctions</Link></li>
          </ul>
          <ul className="navbar-nav mr-auto">
            <li><Link to='/AuctionHistory' style={{ color: 'white' }} >Auction History</Link></li>
          </ul>
          <ul class="navbar-nav mr-auto">
            <li><Link to='/Reward' style={{ color: 'white' }} >Reward</Link></li>
          </ul>
          <form className="d-flex">
            <button onClick={() => this.props.logoutUser()} className="btn btn-outline-success" type="submit">Logout</button>
          </form>
        </div>
      </nav>
    );
  }
}

export default Navbar;