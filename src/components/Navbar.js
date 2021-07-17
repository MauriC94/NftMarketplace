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

  logout(event){
  }

  render() {
    return (
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <a href="#" className="navbar-brand d-flex align-items-center">
            <strong id="account">Account : {this.props.address} </strong>
          </a>
        </div>
        <form className="form-inline my-2 my-lg-0">
          <button onClick={this.logout} className="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>
        </form>
      </div>
    );
  }
}

export default Navbar;