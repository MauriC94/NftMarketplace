const NftMarket = artifacts.require("NftMarket");
const AuctionToken = artifacts.require("AuctionToken");
//const DeadpoolErc721 = artifacts.require("DeadpoolErc721");
//const SupermanErc721 = artifacts.require("SupermanErc721");
//const HulkErc721 = artifacts.require("HulkErc721");

module.exports = async function (deployer) {

  await deployer.deploy(AuctionToken)
  const auctionToken = await AuctionToken.deployed()

/*
  await deployer.deploy(DeadpoolErc721)
  const deadpool = await DeadpoolErc721.deployed()

  await deployer.deploy(SupermanErc721)
  const superman = await SupermanErc721.deployed()

  await deployer.deploy(HulkErc721)
  const hulk = await HulkErc721.deployed()
*/

  await deployer.deploy(NftMarket,auctionToken.address)
  const nftMarket = await NftMarket.deployed()
  
};