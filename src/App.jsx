import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const getEthereumObject = () => window.ethereum;

const findAuthorizedAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.log("Make sure you have Metamask");
      return null;
    }

    console.log("We have ethereum Object", ethereum);

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
const App = () => {
  const [currentAccount, setCurrentAccount] = useState();

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    findAuthorizedAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          My name is Timmy, and I have had the opportunity to work on developing
          cutting-edge web3 applications, which I find to be a particularly
          exciting field. I would be honored if those with an Ethereum wallet
          would connect with me and acknowledge my work with a friendly
          greeting..
        </div>

        <button className="waveButton" onClick={connectWallet}>
          Wave at Me
        </button>
      </div>
    </div>
  );
};

export default App;
