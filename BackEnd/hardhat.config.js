require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const INFURA_KEY_URL = process.env.INFURA_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: INFURA_KEY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
//0x4E8Ef49F5685Fa670f7AFf3D2FE488338C513923
