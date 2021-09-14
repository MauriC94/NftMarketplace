import React, { Component } from 'react';
import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: "",
      password: ""
    }
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAddressChange(event) {
    this.setState({ address: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.address === "0x138cd0dF5B11Bf9dda23f04231Bb23db225C6dC3" && this.state.password === "owner123") {
      localStorage.setItem('address', this.state.address);
      this.props.history.push('/NftMarketplace');

    } else if (this.state.address === "0x4E2E2c34d3118aCc809aD2388D4A551627d0c88c" && this.state.password === "bidder123") {
      localStorage.setItem('address', this.state.address);
      this.props.history.push('/NftMarketplace');

    } else if (this.state.address === "0xCB36091327e0150c7f4D3E5e690C04CAd1C9a768" && this.state.password === "bidder345") {
      localStorage.setItem('address', this.state.address);
      this.props.history.push('/NftMarketplace');
    }
  }


  render() {
    return (
      <>
        <div className="container" id="loginForm">
          <main className="form-signin">
            <form onSubmit={this.handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
              <div className="form-floating">
                <input type="text" className="form-control" id="floatingInput" placeholder="Email"
                  value={this.state.address} onChange={this.handleAddressChange} />
                <label for="floatingInput">Wallet Address</label>
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