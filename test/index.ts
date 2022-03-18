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
      it("Renounce Admin", async () => {
        const adminAddress = await admin.getAddress();
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);

        await SToken.addAdmin(adminAddress);
        expect(await SToken.isAdmin(adminAddress)).to.equal(true);

        await SToken.connect(admin).renounceAdmin();
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);
      });
      it("Remove Admin", async () => {
        const adminAddress = await admin.getAddress();
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);

        await SToken.addAdmin(adminAddress);
        expect(await SToken.isAdmin(adminAddress)).to.equal(true);

        await SToken.removeAdmin(adminAddress);
        expect(await SToken.isAdmin(adminAddress)).to.equal(false);
      });
    });

    describe("Minter", () => {
      it("Set Minter", async () => {
        const minterAddress = await minter.getAddress();
        await SToken.addMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(true);
      });
      it("Non Minter", async () => {
        const minterAddress = await minter.getAddress();
        expect(await SToken.isMinter(minterAddress)).to.equal(false);
      });
      it("Renounce Minter", async () => {
        const minterAddress = await minter.getAddress();
        expect(await SToken.isMinter(minterAddress)).to.equal(false);

        await SToken.addMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(true);

        await SToken.connect(minter).renounceMinter();
        expect(await SToken.isMinter(minterAddress)).to.equal(false);
      });
      it("Remove Minter", async () => {
        const minterAddress = await minter.getAddress();
        expect(await SToken.isMinter(minterAddress)).to.equal(false);

        await SToken.addMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(true);

        await SToken.removeMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(false);
      });
    });

    describe("Burner", async () => {
      it("Set Burner", async () => {
        const burnerAddress = await burner.getAddress();
        await SToken.addBurner(burnerAddress);
        expect(await SToken.isBurner(burnerAddress)).to.equal(true);
      });
      it("Non Burner", async () => {
        const burnerAddress = await burner.getAddress();
        expect(await SToken.isBurner(burnerAddress)).to.equal(false);
      });
      it("Renounce Burner", async () => {
        const burnerAddress = await burner.getAddress();
        expect(await SToken.isBurner(burnerAddress)).to.equal(false);

        await SToken.addBurner(burnerAddress);
        expect(await SToken.isBurner(burnerAddress)).to.equal(true);

        await SToken.connect(burner).renounceBurner();
        expect(await SToken.isBurner(burnerAddress)).to.equal(false);
      });
      it("Remove Burner", async () => {
        const burnerAddress = await burner.getAddress();
        expect(await SToken.isBurner(burnerAddress)).to.equal(false);

        await SToken.addBurner(burnerAddress);
        expect(await SToken.isBurner(burnerAddress)).to.equal(true);

        await SToken.removeBurner(burnerAddress);
        expect(await SToken.isBurner(burnerAddress)).to.equal(false);
      });
    });

    describe("User", async () => {
      it("Non Role", async () => {
        const userAddress = await user.getAddress();
        expect(await SToken.isBurner(userAddress)).to.equal(false);
        expect(await SToken.isAdmin(userAddress)).to.equal(false);
        expect(await SToken.isMinter(userAddress)).to.equal(false);
      });
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
