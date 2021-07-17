import React, { Component } from 'react'
import Web3 from 'web3'
import AuctionToken from '../abis/AuctionToken.json'
import NftMarket from './NftMarket'

class Auction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    render() {
        return (
            <div className="container">
                <h2>Auction Form</h2>
                <div className="h-100 p-5 text-white bg-dark rounded-3">
                    <form className="row gy-2 gx-3 align-items-center">
                        <div className="col-auto">
                            <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                            <select className="form-select" id="autoSizingSelect"
                            value={this.props.selectNft} onChange={this.props.handleNftChange}
                            >
                                <option selected>ERC721</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                            </select>
                        </div>
                        <div className="col-auto">
                            <label className="visually-hidden" for="autoSizingInputGroup">Username</label>
                            <div className="input-group">
                                <div className="input-group-text">MCT Token</div>
                                <input type="text" className="form-control" id="autoSizingInputGroup" placeholder="Starting Bid Price" 
                                value={this.props.selectAuctionPrice} onChange={this.props.handleAuctionPrice}/>
                            </div>
                        </div>
                        <div className="col-auto">
                            <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                            <select className="form-select" id="autoSizingSelect"
                            value={this.props.selectDays} onChange={this.props.handleDayAuction}>
                                <option selected>Days</option>
                                <option value="0">/</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                <option value="4">Four</option>
                                <option value="5">Five</option>
                                <option value="6">Six</option>
                            </select>
                        </div>
                        <div className="col-auto">
                            <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                            <select className="form-select" id="autoSizingSelect"
                            value={this.props.selectHours} onChange={this.props.handleHoursAuction}>
                                <option selected>Hours</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                <option value="4">Four</option>
                                <option value="5">Five</option>
                                <option value="6">Six</option>
                            </select>
                        </div>
                        <div className="col-auto">
                            <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                            <select className="form-select" id="autoSizingSelect"
                            value={this.props.selectMinutes} onChange={this.props.handleMinutesAuction}>
                                <option selected>Minutes</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                <option value="4">Four</option>
                                <option value="5">Five</option>
                                <option value="6">Six</option>
                            </select>
                        </div>
                        <div className="col-auto">
                            <button onClick={()=>this.props.handleAuctionForm()}type="submit" class="btn btn-primary">Start Auction</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Auction;