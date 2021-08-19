const Registry = artifacts.require("Registry");
const AuctionToken = artifacts.require("AuctionToken");

module.exports = async function (deployer,accounts) {
  const account = "0x138cd0dF5B11Bf9dda23f04231Bb23db225C6dC3";
  await deployer.deploy(Registry,{from : account});

  await deployer.deploy(AuctionToken)
  const auctionToken = AuctionToken.deployed()

};