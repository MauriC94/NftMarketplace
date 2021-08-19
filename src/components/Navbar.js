import React, { Component } from 'react'
import Web3 from 'web3'

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
          <a className="navbar-brand"> Account : {this.props.address} </a>
          <a className="navbar-brand">Balance : {this.props.balance} MCT</a>
          <button onClick={this.props.getAuctions} className="btn btn-primary" type="submit">Ongoing Auctions</button>
          <form className="d-flex">
          <button onClick={()=>this.props.logoutUser()} className="btn btn-outline-success" type="submit">Logout</button>
          </form>
        </div>
      </nav>
    );
  }
}

export default Navbar;