import React, { Component } from 'react'

class NftReward extends Component {

    render() {
        return (
            <div className="col-sm-4">
                <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 className="my-0 fw-normal">{this.props.name} </h4>
                        <h6 class="my-0 fw-normal">{this.props.symbol} </h6>
                    </div>
                    <div className="card-body">
                        <img src={this.props.image} className="card-img-top" alt="..." />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>{this.props.description}</li>
                        </ul>
                        <h6 class="my-0 fw-normal"> ERC721 </h6>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled mt-3 mb-4">
                            <li> Price : {this.props.price}</li>
                        </ul>
                        <button onClick={() => this.props.getReward(this.props.auction)} type="button" class="btn btn-primary">Get NFT</button>
                    </div>
                </div>
            </div>
        );
    }

} export default NftReward;