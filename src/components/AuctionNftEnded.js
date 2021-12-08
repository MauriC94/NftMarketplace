import React, { Component } from 'react'
import './Nft.css';
import ReactTooltip from 'react-tooltip';

class AuctionNftEnded extends Component {

    render() {
        return (
            <div className="col-sm-4">
                <div className="card mb-4 rounded-3 shadow-sm" id="cardName">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal" style={{ color: "white" }}> {this.props.name} </h4>
                        <h6 class="my-0 fw-normal" style={{ color: "white" }}>{this.props.symbol} </h6>
                    </div>
                    <div className="card-body">
                        <img src={this.props.image} className="card-img-top" alt="..." />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>{this.props.description}</li>
                        </ul>
                        <h6 class="my-0 fw-normal"> <strong>ERC721</strong> </h6>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled mt-3 mb-4">
                        <li><strong>  Date: </strong> {this.props.datetime} </li>
                            <li data-tip={this.props.address}><strong>  Winner : </strong> {this.props.winner}</li>
                            <ReactTooltip place="top" type="dark" effect="float" />
                            <li><strong id="winningPrice">  Winning Price: </strong> {this.props.price} MCT </li>
                        </ul>
                        <button className="w-100 btn btn-lg btn-success" type="submit" onClick={() => this.props.viewAuction(this.props.symbol)}>View</button>
                    </div>
                </div>
            </div>
        );
    }

} export default AuctionNftEnded;