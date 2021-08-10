import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Web3 from 'web3'
import './App.css'
import Auction from './Auction'
import Login from './Login'
import NftMarketplace from './NftMarketplace'
import OngoingAuction from './OngoingAuction'

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
      loading: true
    }
  }
  
  render() {
    return(
      <Router>
        <div>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/NftMarketplace" exact component={NftMarketplace} />
            <Route path="/Auction" exact component={Auction} />
            <Route path='/OngoingAuction' exact component={OngoingAuction} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;