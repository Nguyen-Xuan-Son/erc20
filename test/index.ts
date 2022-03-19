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
  let otherUser: Signer;

  beforeEach(async () => {
    [owner, minter, burner, admin, user, otherUser] = await ethers.getSigners();
    SToken = await new SToken__factory(owner).deploy("S Token", "STK");
  });

  describe("Transaction", () => {
    it("Transfer", async () => {});
    it("Mint", async () => {
      const minterAddress = await minter.getAddress();
      const userAddress = await user.getAddress();
      await SToken.addMinter(minterAddress);
      expect(await SToken.isMinter(minterAddress)).to.equal(true);

      await SToken.connect(minter).mint(
        minterAddress,
        ethers.BigNumber.from(10).pow(2).mul(ethers.BigNumber.from(10).pow(18))
      );
      await SToken.connect(minter).mint(
        userAddress,
        ethers.BigNumber.from(10).pow(3).mul(ethers.BigNumber.from(10).pow(18))
      );

      const minterBalance = await SToken.balanceOf(minterAddress);
      const userBalance = await SToken.balanceOf(userAddress);

      expect(minterBalance).to.equal(
        ethers.BigNumber.from(10).pow(2).mul(ethers.BigNumber.from(10).pow(18))
      );
      expect(userBalance).to.equal(
        ethers.BigNumber.from(10).pow(3).mul(ethers.BigNumber.from(10).pow(18))
      );
    });

    describe("Burn Transaction", () => {
      it("Burn from burner", async () => {
        const minterAddress = await minter.getAddress();
        const userAddress = await user.getAddress();
        const burnerAddress = await burner.getAddress();

        expect(await SToken.isMinter(minterAddress)).to.equal(false);
        await SToken.addMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(true);

        expect(await SToken.isBurner(burnerAddress)).to.equal(false);
        await SToken.addBurner(burnerAddress);
        expect(await SToken.isBurner(burnerAddress)).to.equal(true);

        await SToken.connect(minter).mint(
          userAddress,
          ethers.BigNumber.from(10)
            .pow(3)
            .mul(ethers.BigNumber.from(10).pow(18))
        );

        expect(await SToken.balanceOf(userAddress)).to.equal(
          ethers.BigNumber.from(10)
            .pow(3)
            .mul(ethers.BigNumber.from(10).pow(18))
        );

        await SToken.connect(burner).burnFromUser(
          userAddress,
          ethers.BigNumber.from(10).mul(ethers.BigNumber.from(10).pow(18))
        );

        expect(await SToken.balanceOf(userAddress)).to.equal(
          ethers.BigNumber.from(
            ethers.BigNumber.from(10)
              .pow(3)
              .sub(ethers.BigNumber.from(10).pow(1))
          ).mul(ethers.BigNumber.from(10).pow(18))
        );
      });
      it("Burn", async () => {
        const minterAddress = await minter.getAddress();
        const userAddress = await user.getAddress();

        await SToken.addMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(true);

        await SToken.connect(minter).mint(
          userAddress,
          ethers.BigNumber.from(10)
            .pow(3)
            .mul(ethers.BigNumber.from(10).pow(18))
        );

        expect(await SToken.balanceOf(userAddress)).to.equal(
          ethers.BigNumber.from(10)
            .pow(3)
            .mul(ethers.BigNumber.from(10).pow(18))
        );

        await SToken.connect(user).burn(
          ethers.BigNumber.from(10)
            .pow(1)
            .mul(ethers.BigNumber.from(10).pow(18))
        );

        expect(await SToken.balanceOf(userAddress)).to.equal(
          ethers.BigNumber.from(
            ethers.BigNumber.from(10)
              .pow(3)
              .sub(ethers.BigNumber.from(10).pow(1))
          ).mul(ethers.BigNumber.from(10).pow(18))
        );
      });

      it("Burn from other people", async () => {
        const minterAddress = await minter.getAddress();
        const userAddress = await user.getAddress();
        const otherUserAddress = await otherUser.getAddress();
        const adminAddress = await admin.getAddress();

        expect(await SToken.isAdmin(adminAddress)).to.equal(false);
        await SToken.addAdmin(adminAddress);
        expect(await SToken.isAdmin(adminAddress)).to.equal(true);

        expect(await SToken.isMinter(minterAddress)).to.equal(false);
        await SToken.connect(admin).addMinter(minterAddress);
        expect(await SToken.isMinter(minterAddress)).to.equal(true);

        await SToken.connect(minter).mint(
          userAddress,
          ethers.BigNumber.from(10)
            .pow(3)
            .mul(ethers.BigNumber.from(10).pow(18))
        );

        await SToken.allowance(userAddress, otherUserAddress);
        await SToken.connect(user).approve(
          otherUserAddress,
          ethers.BigNumber.from(10).mul(ethers.BigNumber.from(10).pow(18))
        );
        await SToken.connect(otherUser).transferFrom(
          userAddress,
          otherUserAddress,
          ethers.BigNumber.from(5).mul(ethers.BigNumber.from(10).pow(18))
        );

        expect(await SToken.balanceOf(userAddress)).to.equal(
          ethers.BigNumber.from(995).mul(ethers.BigNumber.from(10).pow(18))
        );
        expect(await SToken.balanceOf(otherUserAddress)).to.equal(
          ethers.BigNumber.from(5).mul(ethers.BigNumber.from(10).pow(18))
        );

        await SToken.connect(otherUser).burnFrom(
          userAddress,
          ethers.BigNumber.from(2).mul(ethers.BigNumber.from(10).pow(18))
        );
        expect(await SToken.balanceOf(otherUserAddress)).to.equal(
          ethers.BigNumber.from(3).mul(ethers.BigNumber.from(10).pow(18))
        );
      });
    });
  });

  describe("Validate", () => {
    it("Mint", async () => {
      const minterAddress = await minter.getAddress();
      const userAddress = await user.getAddress();
      const adminAddress = await admin.getAddress();

      expect(await SToken.isAdmin(adminAddress)).to.equal(false);
      await SToken.addAdmin(adminAddress);
      expect(await SToken.isAdmin(adminAddress)).to.equal(true);

      expect(await SToken.isMinter(minterAddress)).to.equal(false);
      await SToken.connect(admin).addMinter(minterAddress);
      expect(await SToken.isMinter(minterAddress)).to.equal(true);

      await SToken.connect(minter).mint(
        userAddress,
        ethers.BigNumber.from(10).pow(9).mul(ethers.BigNumber.from(10).pow(18))
      );
      expect(await SToken.balanceOf(userAddress)).to.equal(
        ethers.BigNumber.from(10).pow(9).mul(ethers.BigNumber.from(10).pow(18))
      );
    });
  });
});
