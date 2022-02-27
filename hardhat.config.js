require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    // compiled smart constracts.
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      // should match metamask port.
      chainId: 1337,
    },
  },
};
