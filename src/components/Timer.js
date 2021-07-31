import React, { Component } from 'react'
import NftMarket from '../abis/NftMarket.json'

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
            loading: true
        };
    }
    async componentDidMount() {
        await this.loadBlockchainData()
        this.interval = setInterval(() => this.tick(), 1000);
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const marketData = NftMarket.networks[networkId]

        if (marketData) {
            const nftMarket = new web3.eth.Contract(NftMarket.abi, marketData.address)
            let timer = await nftMarket.methods.auction_end().call()
            this.setState({ timer })
            let auctionState = await nftMarket.methods.STATE().call()
            this.setState({ auctionState })

        } else {
            window.alert('NftMarket contract not deployed to detected network')
        }
        this.setState({ loading: false })
    }

    tick() {
        this.setState(state => ({
            timer: state.timer - 1
        }));

        if (this.state.timer === 0) {
            this.componentWillUnmount();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.setState({ over: true });
        this.props.handleTimerOver();
    }

    render() {
        return (
            <div>
                {this.state.over ? "Time is Up!" : 'Seconds : ' + this.state.timer}
            </div>

        );
    }
}

export default Timer;