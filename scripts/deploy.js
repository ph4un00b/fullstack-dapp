// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, jamon!");

  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory("PHAUToken");
  const token = await Token.deploy("La token del phau", "HDTPM");

  await greeter.deployed();
  await token.deployed();

  // rpc address as endpoints.
  // we can automate the any process by copying the address
  // to a file and then fetching it.
  fs.writeFileSync(
    "./src/endpoints.json",
    JSON.stringify(
      { Greeter: greeter.address, Token: token.address },
      undefined,
      2,
    ),
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
