import React, { Component } from 'react'
import Web3 from 'web3'
import AuctionToken from '../abis/AuctionToken.json'
import NftForm from './NftForm';

class BidForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    render() {
        return (
            <div className="container">
                <div className="h-100 p-5 text-white bg-dark rounded-3">
                    <div className="container">
                        <form onSubmit={this.props.handleAuctionForm} className="row gy-2 gx-3 align-items-center">
                            <div className="col-auto">
                                <label className="visually-hidden" for="autoSizingInputGroup">Username</label>
                                <div className="input-group">
                                    <div className="input-group-text">MCT Token</div>
                                    <input type="text" className="form-control" id="autoSizingInputGroup" placeholder=""
                                        onChange={this.props.handleAuctionPrice} />
                                </div>
                            </div>
                            <div className="col-auto">
                                <button type="submit" class="btn btn-primary">Bid</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default BidForm;