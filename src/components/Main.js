import React, { Component } from 'react'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
        <div className="card mb-4" >
          <div className="card-body">
              <div>
                <label className="float-left"><b>MCT Tokens</b></label>
                  <span className="float-right text-muted">                 
                </span>
              </div>

              <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                //amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.firstBidder(amount)
                this.props.handlefirstBidSubmit(amount)
              }}>
              <div className="input-group mb-4">
              <input
                  type="text"
                  ref={(input1) => { this.input = input1 }}
                  className="form-control form-control-lg"
                  placeholder="bid amount"
                  required />
              </div>
              <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <button type="submit" className="btn btn-primary btn-block btn-lg">firstBidder</button>
                <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              onClick={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                this.props.secondBidder()
                this.props.handlesecondBidSubmit(amount)
              }}>
                secondBidder
              </button>
            </div>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.withdraw() // withdraw
              }}>
                WITHDRAW
              </button>
          </div>
        </div>
      </div>     
    );
  }
}



export default Main;