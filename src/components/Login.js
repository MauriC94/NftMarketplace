import React, { Component } from 'react';
import Web3 from 'web3'
import Registry from '../abis/Registry.json'

import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()

    const registryData = Registry.networks[networkId]
    const registry = new web3.eth.Contract(Registry.abi, registryData.address)
    this.setState({ registry })


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

  handleUserChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault()

    const userData = await this.state.registry.methods.getUser(this.state.username).call();
    if(userData[1] == this.state.username && userData[2] == this.state.password){
      localStorage.setItem('address', userData[0]);
      this.props.history.push('/NftMarketplace');
    }else if(userData[1] == this.state.username && userData[2] != this.state.password){
      alert("Wrong Password!");
    }else if(userData[1] != this.state.username && userData[2] == this.state.password){
      alert("Wrong Username!");
    }else{
      alert("User not found!");
    }
  }


  render() {
    return (
      <>
        <div className="Login-component" id="loginForm">
          <main className="form-signin">
            <form onSubmit={this.handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingInput" placeholder="Email"
                  value={this.state.address} onChange={this.handleUserChange} />
                <label for="floatingInput">Username</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                  value={this.state.password} onChange={this.handlePasswordChange} />
                <label for="floatingPassword">Password</label>
              </div>
              <div className="checkbox mb-3">
              </div>
              <button className="w-100 btn btn-lg btn-primary" type="submit">Enter</button>
            </form>
          </main>
        </div>
      </>
    );
  }
}

export default Login;