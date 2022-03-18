import { ethers } from "hardhat";

async function main() {
  const SToken = await ethers.getContractFactory("SToken");
  const sToken = await SToken.deploy("S TOKEN", "STK");
  await sToken.deployed();

  console.log("Greeter deployed to:", sToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
