import { Signer } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SToken, SToken__factory } from "../typechain";

describe("Testing SToken", () => {
  let SToken: SToken;
  let owner: Signer;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    SToken = await new SToken__factory(owner).deploy("S Token", "STK");
  });

  describe("Metadata", () => {
    it("Name and symbol", async () => {
      expect(await SToken.name()).to.equal("S Token");
      expect(await SToken.symbol()).to.equal("STK");
    });

    it("Decimal", async () => {
      expect(await SToken.decimals()).to.equal(18);
    });

    it("Max supply", async () => {
      expect(await SToken.maxSupply()).to.equal(
        ethers.BigNumber.from(10).pow(9).mul(ethers.BigNumber.from(10).pow(18))
      );
    });
  });
});
