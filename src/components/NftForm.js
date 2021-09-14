import React, { Component } from 'react'
import './NftForm.css';

class NftForm extends Component {

    render() {
        return (
            <option value={this.props.id}> {this.props.symbol} </option>
        );
    }

}

export default NftForm;
