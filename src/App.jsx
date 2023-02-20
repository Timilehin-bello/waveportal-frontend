import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Loading from "react-loading";
import CONTRACT_ABI from "./utils/WavePortal.json";
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
  const [waveCount, setwaveCount] = useState();
  const [isLoading, setisLoading] = useState(false);

  const contractAddress = "0xE0BbC9d35F09130aC954f5B8E3F9Ba9d8D1564f8";

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

  const wave = async () => {
    try {
      setisLoading(true);
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          CONTRACT_ABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setisLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalWaveCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          CONTRACT_ABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        setwaveCount(count.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findAuthorizedAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });

    getTotalWaveCount();
  }, [getTotalWaveCount]);

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
          <p>
            {waveCount === undefined ? (
              <h2> Connect your wallet</h2>
            ) : (
              <h2> Total number of waves: {waveCount}</h2>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="loader">
            <Loading type="spinningBubbles" color="#333" />
          </div>
        ) : (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
