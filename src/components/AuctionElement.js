import React, { Component } from 'react'
import Nft from './Nft'

class AuctionElement extends Component {

    render() {
        return (
            <div className="col-sm-4" id="nftBody">
                <div className="card mb-4 rounded-3 shadow-sm" id="cardName">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal" style={{color:"white"}}>{this.props.name} </h4>
                        <h6 class="my-0 fw-normal" style={{color:"white"}}>{this.props.symbol} </h6>
                    </div>
                    <div className="card-body">
                        <img src={this.props.image} class="card-img-top" alt="..." />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>{this.props.description}</li>
                        </ul>
                        <h6 class="my-0 fw-normal"> ERC721 </h6>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>Auction base : {this.props.amount}</li>
                        </ul>
                        <button onClick={() => this.props.joinAuction(this.props.auction)} type="button" class="btn btn-primary">Enter</button>
                    </div>
                </div>
            </div>
        );
    }

} export default AuctionElement;
