import React, { Component } from 'react'
import Web3 from 'web3'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'

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
          <a className="navbar-brand" style={{ color: 'orange' }}> Account : {this.props.address} </a>
          <a className="navbar-brand" style={{ color: 'orange' }}> Balance : {this.props.balance} MCT</a>
          <ul class="navbar-nav mr-auto">
            <li><Link to='/NftMarketplace' style={{ color: 'white' }} >Home</Link></li>
          </ul>
          <ul className="navbar-nav mr-auto">
            <li><Link to='/OwnedAuctions' style={{ color: 'white' }} >My Auctions</Link></li>
          </ul>
          <ul className="navbar-nav mr-auto">
            <li><Link to='/OngoingAuctions' style={{ color: 'white' }} >Ongoing Auctions</Link></li>
          </ul>
          <ul class="navbar-nav mr-auto">
            <li><Link to='/Reward' style={{ color: 'white' }} >Reward</Link></li>
          </ul>
          <ul class="navbar-nav mr-auto">
            <button onClick={this.props.withdraw} type="button" class="btn btn-success">
              Withdraw <span class="badge badge-light">{this.props.refund}</span>
            </button>
          </ul>
          <form className="d-flex">
            <button onClick={() => this.props.logoutUser()} className="btn btn-outline-success" type="submit">Logout</button>
          </form>
        </div>
      </nav>
    );
  }
}
/*
render() {
  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand"> Account : {this.props.address} </a>
        <a className="navbar-brand">Balance : {this.props.balance} MCT</a>
        <button onClick={() => this.props.getAuctions()} className="btn btn-primary" type="submit">Ongoing Auctions</button>
        <button onClick={() => this.props.myAuctions()} className="btn btn-primary" type="submit">My Auctions</button>
        <button onClick={() => this.props.rewards()} className="btn btn-success" type="submit">Rewards</button>
        <button onClick={this.props.withdraw} type="button" class="btn btn-success">
          Withdraw <span class="badge badge-light">{this.props.refund}</span>
        </button>
        <button onClick={() => this.props.homepage()} className="btn btn-warning" type="submit">HOME</button>
        <form className="d-flex">
          <button onClick={() => this.props.logoutUser()} className="btn btn-outline-success" type="submit">Logout</button>
        </form>
      </div>
    </nav>
  );
}*/

export default Navbar;