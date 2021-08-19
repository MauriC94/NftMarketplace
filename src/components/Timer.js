import React, { Component, useState } from 'react'
import NftMarket from '../abis/NftMarket.json'

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: {},
            timer: 0,
            over: false,
            loading: true
        }
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.closeAuction = this.closeAuction.bind(this);
    }

    async componentDidMount() {
        await this.loadBlockchainData()
        if (this.state.timeLeft > 0) {
            this.startTimer();
        } else {
            this.setState({ over: true });
        }

    }

    async loadBlockchainData() {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const marketData = NftMarket.networks[networkId]

        if (marketData) {
            const nftMarket = new web3.eth.Contract(NftMarket.abi, marketData.address)
            const auctionTime = await nftMarket.methods.auction_end().call()
            const timeLeft = auctionTime - Math.floor((new Date()).getTime() / 1000);
            if (timeLeft < 0)
                this.closeAuction();
            this.setState({ timeLeft })

            let auctionState = await nftMarket.methods.STATE().call()
            this.setState({ auctionState })

        } else {
            window.alert('NftMarket contract not deployed to detected network')
        }
        this.setState({ loading: false })
    }

    startTimer() {
        this.timer = setInterval(this.countDown, 1000);

    }

    countDown() {
        let seconds = this.state.timeLeft - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            timeLeft: seconds,
        });

        if (this.state.time.h === 0 && this.state.time.m === 0 && this.state.time.s === 0) { // da provare
            console.log("time over");
            this.closeAuction();
        }
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    closeAuction() {
        clearInterval(this.interval);
        this.setState({ over: true });
        this.props.handleTimerOver();
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    {this.state.over ? <h4>Time is up!!</h4> : ["H : " + this.state.time.h + "  " + " M : " + this.state.time.m + "  " + " S : " + this.state.time.s]}
                </div>
            </div>

        );
    }
}

export default Timer;