import React, { Component } from 'react'
import NftForm from './NftForm';

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
                    <div className="container">
                        <form onSubmit={this.props.handleAuctionForm} className="row gy-2 gx-3 align-items-center">
                            <div className="col-auto">
                                <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                                <select className="form-select" id="autoSizingSelect"
                                    onChange={this.props.handleNftChange}
                                >
                                    <option selected>ERC721</option>
                                    {this.props.ercMetadata.map(erc => (
                                        <NftForm
                                            key={erc.id}
                                            name={erc.name}
                                        />
                                    ))}
                                </select>
                            </div>
                            <div className="col-auto">
                                <label className="visually-hidden" for="autoSizingInputGroup">Username</label>
                                <div className="input-group">
                                    <div className="input-group-text">MCT Token</div>
                                    <input type="text" className="form-control" id="autoSizingInputGroup" placeholder="Starting Bid Price"
                                        value={this.props.selectAuctionPrice} onChange={this.props.handleAuctionPrice} />
                                </div>
                            </div>
                            <div className="col-auto">
                                <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                                <select className="form-select" id="autoSizingSelect"
                                    value={this.props.selectDays} onChange={this.props.handleDayAuction}>
                                    <option selected>Days</option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                            <div className="col-auto">
                                <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                                <select className="form-select" id="autoSizingSelect"
                                    value={this.props.selectHours} onChange={this.props.handleHoursAuction}>
                                    <option selected>Hours</option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </select>
                            </div>
                            <div className="col-auto">
                                <label className="visually-hidden" for="autoSizingSelect">Preference</label>
                                <select className="form-select" id="autoSizingSelect"
                                    value={this.props.selectMinutes} onChange={this.props.handleMinutesAuction}>
                                    <option selected>Minutes</option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                            <div className="col-auto">
                                <button type="submit" class="btn btn-primary">Start Auction</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Auction;