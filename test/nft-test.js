const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  /**
   * Тест минта 
   */
  it("Test mint", async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const [owner] = await ethers.getSigners();
    const nft = await NFT.deploy(owner.address);
    await nft.deployed();
    const mintToken = await nft.mint("Test", { value: ethers.utils.parseEther("0.001") });
    await mintToken.wait();
    expect(await nft.balanceOf(owner.address)).to.equal(1);
  });
});
