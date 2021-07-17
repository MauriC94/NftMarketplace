import React, { Component,useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import Web3 from 'web3'
import './App.css'
import Navbar from './Navbar'
import Auction from './Auction'
import Login from './Login'
import NftMarket from './NftMarket'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
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

  constructor(props){
    super(props);
    this.state = {
      loading: false
    }
  }
  
  render() {
    return(
      <Router>
        <div>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/NftMarket" exact component={NftMarket} />
            <Route path="/Auction" exact component={Auction} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;