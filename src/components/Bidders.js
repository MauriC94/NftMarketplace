import React, { Component } from 'react'

class Bidders extends Component {

    render() {
        return (
            <li className="list-group-item d-flex justify-content-between align-items-center">
                { this.props.bidder }
                <span className="badge bg-primary rounded-pill">{ this.props.bidAmount + " mct" }</span>
            </li>
        );
    }

}

export default Bidders;


