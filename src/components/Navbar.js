import React, { Component } from 'react'
import Web3 from 'web3'
import Login from './Login';

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
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <a href="#" className="navbar-brand d-flex align-items-center">
            <h6 id="account">Account : {this.props.address} </h6>
          </a>
          <button onClick={this.props.getAuctions} className="btn btn-primary" type="submit">Ongoing Auctions</button>
          <button onClick={()=>this.props.getAuctions()} className="btn btn-outline-success" type="submit">Logout</button>
        </div>
      </div>
    );
  }
}

export default Navbar;