import React, { Component } from 'react'
import './Nft.css'

class NftReward extends Component {

    render() {
        return (
            <div className="col-sm-4">
                <div className="card mb-4 rounded-3 shadow-sm" id="cardName" >
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal" style={{ color: "white" }}>{this.props.name} </h4>
                        <h6 className="my-0 fw-normal" style={{ color: "white" }}>{this.props.symbol} </h6>
                    </div>
                    <div className="card-body">
                        <img src={this.props.image} className="card-img-top" alt="..." />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>{this.props.description}</li>
                        </ul>
                        <h6 class="my-0 fw-normal"> <strong>ERC721</strong></h6>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled mt-3 mb-4">
                            <li> <strong>Date : </strong>{this.props.date} </li>
                        </ul>
                        <ul className="list-unstyled mt-3 mb-4">
                            <li> <strong id="winningPrice">Winning Price : </strong>{this.props.price} MCT </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

} export default NftReward;