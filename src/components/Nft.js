import React, { Component } from 'react'
import './Nft.css'

class Nft extends Component {

    render() {
        return (
            <div className="col-sm-4" id="nftBody">
                <div className="card mb-4 rounded-3 shadow-sm" id="cardName">
                    <div className="card-header py-3">
                        <h4 class="my-0 fw-normal" style={{color:"white"}}> {this.props.name} </h4>
                        <h6 class="my-0 fw-normal" style={{color:"white"}}> {this.props.symbol} </h6>
                    </div>
                    <div className="card-body">
                    <h1 class="card-title pricing-card-title">{this.props.price}<small class="text-muted fw-light">{this.props.erc20}</small></h1>
                        <img src={this.props.image} id="nftImage"className="card-img-top" alt="..." />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>{this.props.description}</li>
                        </ul>
                        <h6 class="my-0 fw-normal"> ERC721 </h6>
                    </div>
                </div>
            </div>
        );
    }
}

export default Nft;


