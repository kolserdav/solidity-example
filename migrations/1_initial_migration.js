const Greeter = artifacts.require("Greeter");
const NFT = artifacts.require("NFT");

module.exports = function (deployer) {
  deployer.deploy(Greeter, "Hello, world!");
  deployer.deploy(NFT);
};
