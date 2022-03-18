import { Signer } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SToken, SToken__factory } from "../typechain";

describe("Testing SToken", () => {
  let SToken: SToken;
  let owner: Signer;
  let minter: Signer;
  let burner: Signer;
  let admin: Signer;
  let user: Signer;

  beforeEach(async () => {
    [owner, minter, burner, admin, user] = await ethers.getSigners();
    SToken = await new SToken__factory(owner).deploy("S Token", "STK");
  });

  describe("Transaction", () => {
    it("Transfer", async () => {});
    it("Mint", async () => {});
    it("Burn", async () => {});
  });

  describe("Validate", () => {
    it("Transfer", async () => {});
  });
});
