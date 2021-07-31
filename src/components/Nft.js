import React, { Component } from 'react'

class Nft extends Component {

    render() {
        return (
            <div className="col">
                <div className="card mb-4 rounded-3 shadow-sm">
                    <div className="card-header py-3">
                        <h4 class="my-0 fw-normal">{this.props.name}</h4>
                    </div>
                    <div className="card-body">
                        <img src={this.props.image} class="card-img-top" alt="..." />
                        <ul className="list-unstyled mt-3 mb-4">
                            <li>{this.props.description}</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

}

export default Nft;


