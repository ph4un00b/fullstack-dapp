import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.5.4/ethers.esm.js";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json" assert {
  type: "json",
};
import endpoint from "./endpoints.json" assert { type: "json" };
import {
  createApp,
  reactive,
} from "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module";

const [greet_address] = endpoint;
console.log(greet_address);

async function request_account() {
  const { ethereum } = window;
  if (ethereum) {
    await ethereum.request({ method: "eth_requestAccounts" });
  }
}

function App() {
  return {
    greeting: "jamon",
    open: false,
    toggle() {
      this.open = !this.open;
    },
    async fetch_greeting() {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          greet_address,
          Greeter.abi,
          provider,
        );

        try {
          // calling available read functions!
          const data = await contract.greet();
          console.log("solidity", data);
        } catch (err) {
          console.error(err);
        }
      }
    },
    async set_greeting() {
      if (this.greeting === "") return;
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);
        // promp the user
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          greet_address,
          Greeter.abi,
          signer,
        );

        const tx = await contract.setGreeting(this.greeting);
        await tx.wait();
        await this.fetch_greeting();
      }
    },
  };
}

createApp({ App }).mount("#web3test");
