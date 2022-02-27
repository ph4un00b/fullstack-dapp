import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.5.4/ethers.esm.js";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json" assert {
  type: "json",
};
import Token from "./artifacts/contracts/Token.sol/Token.json" assert {
  type: "json",
};
import endpoints from "./endpoints.json" assert { type: "json" };
import {
  createApp,
  reactive,
} from "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module";

const { Greeter: greet_address, Token: token_address } = endpoints;
console.log("greet: ", greet_address);
console.log("token: ", token_address);

async function request_account() {
  const { ethereum } = window;
  if (ethereum) {
    await ethereum.request({ method: "eth_requestAccounts" });
  }
}

function App() {
  return {
    greeting: "hola!",
    account: "",
    amount: 0,
    fetch_greeting,
    set_greeting,
    get_balance,
    send_coins
  };

  async function get_balance() {
    const { ethereum } = window;
    if (!ethereum) return;
    // fetch all accounts the user allow.
    const [account] = await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(token_address, Token.abi, provider);
    const balance = await contract.balanceOf(account);
    console.log("crr-balance", BigInt(balance));
  }

  async function send_coins() {
    const { ethereum } = window;
    if (!ethereum) return;
    await request_account()
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token_address, Token.abi, signer);
    const tx = await contract.transfer(this.account, this.amount)
    await tx.wait()
    console.log(`${this.amount} coins sent 2 ${this.account}`)
  }

  async function set_greeting() {
    if (this.greeting === "") return;
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      // MetaMask requires requesting permission to connect users accounts
      // promp the user
      await provider.send("eth_requestAccounts", []);
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
  }

  async function fetch_greeting() {
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
  }
}

createApp({ App }).mount("#web3test");
