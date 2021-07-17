import React, { Component } from 'react'

class Nft extends Component {

    render() {
        return (
            <div className="col">
                <h2 className="mb-5"> Owned ERC721 </h2>
                <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div className="col">
                        <div className="card mb-4 rounded-3 shadow-sm">
                            <div className="card-header py-3">
                                <h4 className="my-0 fw-normal">{this.props.name}</h4>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled mt-3 mb-4">
                                    <li>{this.props.description}</li>
                                    <img src={this.props.image} width="250" height="250"></img>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Nft;