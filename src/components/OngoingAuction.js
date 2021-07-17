import React, { Component } from 'react'
import Navbar from '../Navbar'
import Nft from 'Nft'

class OngoingAuction extends Component {

    render(){
        return(
            <>
            < Navbar />
            < Nft />
            <div class="container">
                <h2> Auction Bid Price : {} </h2>
                <h4> </h4>
            </div>
            </>
        );
    }
    
}export default OngoingAuction;