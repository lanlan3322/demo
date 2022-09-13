const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  //const [deployer] = await ethers.getSigners();
  //const balance = await deployer.getBalance();
  const HashedPersona = await hre.ethers.getContractFactory("HashedPersona");
  const HashedPersonaContract = await HashedPersona.deploy();

  await HashedPersonaContract.deployed();

  const data = {
    address: HashedPersonaContract.address,
    abi: JSON.parse(HashedPersonaContract.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./src/HashedPersona.json', JSON.stringify(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
