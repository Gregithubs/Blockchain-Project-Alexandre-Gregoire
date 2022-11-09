const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });


async function main() {
  
  const marketplaceContract = await ethers.getContractFactory("Marketplace")
  const nftTokenContract = await ethers.getContractFactory("NftToken");

  const deployedMarketplace = await marketplaceContract.deploy()
  console.log("Marketplace Contract Address:", deployedMarketplace.address);
  const marketplaceContractAddress = deployedMarketplace.address
  const deployedNftTokenContract = await nftTokenContract.deploy(marketplaceContractAddress);

  console.log("NftToken Contract Address:", deployedNftTokenContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });