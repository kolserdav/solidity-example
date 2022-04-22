const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  /**
   * Тест минта 
   */
  it("Test mint", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    const mintToken = await nft.mint("Test");
    await mintToken.wait();
    const [owner] = await ethers.getSigners()
    expect(await nft.balanceOf(owner.address)).to.equal(1);
  });
});
