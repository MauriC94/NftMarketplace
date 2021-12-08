import React, { Component } from 'react'

class Bidders extends Component {

    render() {
        return (
            <li className="list-group-item d-flex justify-content-between align-items-center" style={{marginTop:"10px", marginBottom:"10px"}}>
                { this.props.bidder } ({this.props.address})
                <span className="badge bg-primary rounded-pill">{ this.props.bidAmount + " mct" }</span>
            </li>
        );
    }

}

export default Bidders;


