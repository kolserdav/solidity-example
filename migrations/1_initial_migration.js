const NFT = artifacts.require("NFT");

module.exports = function (deployer) {
  deployer.deploy(NFT, "0x4212A485A7aD43192139d054544fBC3fC806CFc1");
};
