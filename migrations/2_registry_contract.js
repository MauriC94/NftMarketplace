const Registry = artifacts.require("Registry");
const AuctionToken = artifacts.require("AuctionToken");

const Superman = artifacts.require("SupermanErc721.sol");
const Hulk = artifacts.require("HulkErc721.sol");
const Cyborg = artifacts.require("CyborgErc721.sol.sol");
const PeterPan = artifacts.require("PeterpanErc721.sol");
const Cinderella = artifacts.require("CinderellaErc721.sol");
const AxlRose = artifacts.require("AxlRoseErc721.sol");
const CaptainAmerica = artifacts.require("CaptainAmericaErc721.sol");
const Groot = artifacts.require("GrootErc721.sol");


module.exports = async function (deployer,accounts) {
  //const account = "0x138cd0dF5B11Bf9dda23f04231Bb23db225C6dC3";
  await deployer.deploy(Registry);
  await deployer.deploy(Superman);
  await deployer.deploy(Hulk);
  await deployer.deploy(Cyborg);
  await deployer.deploy(PeterPan);
  await deployer.deploy(Cinderella);
  await deployer.deploy(AxlRose);
  await deployer.deploy(CaptainAmerica);
  await deployer.deploy(Groot);
};