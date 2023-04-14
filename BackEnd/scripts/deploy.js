const { ethers } = require("hardhat");
require("dotenv").config();

const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  const cryptoDevNftContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;

  const cryptoDevTokenContract = await ethers.getContractFactory(
    "CryptoDevToken"
  );
  const deployCryptoDevsTokenContract = await cryptoDevTokenContract.deploy(
    cryptoDevNftContract
  );
  await deployCryptoDevsTokenContract.deployed();

  console.log(
    "crypyo devs token contract address",
    deployCryptoDevsTokenContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
