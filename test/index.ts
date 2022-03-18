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

  describe("Role", () => {
    describe("Admin", () => {
      it("Set Admin", async () => {
        const adminAddress = await admin.getAddress();
        await SToken.addAdmin(adminAddress);

        expect(await SToken.isAdmin(adminAddress)).to.equal(true);
      });
      it("Non Admin", async () => {
        const adminAddress = await admin.getAddress();
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);
      });
      it("Remove Admin", async () => {
        const adminAddress = await admin.getAddress();
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);

        await SToken.addAdmin(adminAddress);
        expect(await SToken.isAdmin(adminAddress)).to.equal(true);

        await SToken.renounceAdmin(adminAddress);
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);
      });
    });

    describe("Minter", () => {
      it("Transfer", async () => {});
    });

    describe("Burner", () => {
      it("Transfer", async () => {});
    });
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
