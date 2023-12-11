import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { AddressLike, BigNumberish, getAddress } from "ethers";
const { assert } = require("chai");
import { ethers } from "hardhat";

describe("Proxy", function () {
  async function deployFixture() {
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    const proxyAsLogic1 = await ethers.getContractAt(
      "Logic1",
      await proxy.getAddress()
    );

    const proxyAsLogic2 = await ethers.getContractAt(
      "Logic2",
      await proxy.getAddress()
    );

    return { proxy, logic1, logic2, proxyAsLogic1, proxyAsLogic2 };
  }

  // コントラクトのstorageを読む関数
  async function lookupUint(contractAddr: AddressLike, slot: BigNumberish) {
    return parseInt(await ethers.provider.getStorage(contractAddr, slot));
  }

  describe("Deployment", function () {
    // Logic1が想定通りに動くかのテスト
    it("Should work logic1", async function () {
      const { proxy, logic1, proxyAsLogic1 } = await loadFixture(deployFixture);

      await proxy.changeImplementation(await logic1.getAddress());

      assert.equal(await lookupUint(await logic1.getAddress(), "0x0"), 0);

      await proxyAsLogic1.changeX(52);

      assert.equal(await lookupUint(await logic1.getAddress(), "0x0"), 52);
    });

    // Logic1->Logic2にアップグレードするテスト
    it("Should work upgrades", async function () {
      const { proxy, logic1, logic2, proxyAsLogic1, proxyAsLogic2 } =
        await loadFixture(deployFixture);

      await proxy.changeImplementation(await logic1.getAddress());

      assert.equal(await lookupUint(await logic1.getAddress(), "0x0"), 0);

      await proxyAsLogic1.changeX(45);

      assert.equal(await lookupUint(await logic1.getAddress(), "0x0"), 45);

      await proxyAsLogic2.changeX(25);

      assert(await lookupUint(await proxy.getAddress(), "0x0"), 75);
    });
  });
});
