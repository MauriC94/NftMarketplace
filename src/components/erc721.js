import axios from 'axios'

let init = async () => {
    await ethStore.setProvider("https://api.avax-test.network/ext/bc/C/rpc");
    await ethStore.setBrowserProvider();
    let contract = await new $web3.eth.Contract(abi, contractAddress);
    if ($chainId != 43113) {
        alert("Warning: You are not connected to Avalanche Fuji test-net!");
    }
    return contract;
};
setContext("myContract", init());


export function ipfs_url_from_hash(h) {
  return "https://ipfs.io/ipfs/" + h;
}

// retrieve all the nft on the account

export const getURL = (contract) => async (i) => {
    let myContract = await contract;
    try {
        let val = await myContract.methods.tokenURI(i).call({from:get(selectedAccount)});
        let url = await ipfs_url_from_hash(val);
        let res = await axios.get(url);
        let desc = await res.data.properties.image.description;
        let ret = (await "https://ipfs.io/ipfs/") + desc;
        return ret;
    } catch (err) {
        console.warn("Error: " + err);
    }
};