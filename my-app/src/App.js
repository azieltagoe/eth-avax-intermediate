import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import {ethers} from "ethers";
import abi from "./contract/abi.json"

function App() {

  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();

  const [userAddress, setUserAddress] = useState('disconnected');
  const [connectWalletButtonText, setConnectWalletButtonText] = useState('Connect Wallet');


  const contractAddress = "0x1B7BD58199d0f1AFa8C85C97b6A73567fD0a6afa"
  const blockchain = "sepolia testnet"

  const [waterLevel, setWaterLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(5);


  async function getWallet() {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
		setContract(tempContract);	

    window.ethereum.request({ method: "eth_requestAccounts" })
      .then(result => {
        setUserAddress(result[0]);
        setConnectWalletButtonText("Connected");
      })
      .catch(error => {
        alert(error.message);
      });

  }


  async function getWaterLevel() {
    let cupLevel = await contract.cup();
    let maxLevel = await contract.maxLiters();
    setWaterLevel(cupLevel.toNumber());
    setMaxLevel(maxLevel.toNumber());
  }

  async function addWater() {
    await getWaterLevel();

    if (waterLevel == maxLevel) {
      alert("you can't add more water, the cup is full");
      return;
    }

    try {
      let tx = await contract.addWater(1);

      await tx.wait();
  
      getWaterLevel();

    } catch (error) {
      alert(error.message);
      alert(" transaction failed. user may have denied transaction")
    }

  }


  async function pourWater() {
    await getWaterLevel();

    if (waterLevel == 0) {
      alert("you can't take out any more water, the cup is empty");
      return;
    }

    try {
      let tx = await contract.pourWater(1);

      await tx.wait();
  
      getWaterLevel();

    } catch (error) {
      alert(error.message);
      alert(" transaction failed. user may have denied transaction")
    }

  }


  return (
    <div className="App">
        <h1> AziTag's Cup</h1>
        <p1>deployed to {blockchain}</p1>
        <button id="connectWallet" onClick={getWallet}>{connectWalletButtonText}</button>
        <button id="userAddress" disabled="true">{userAddress}</button>
        <button id="addWater" onClick={addWater}> Add Water</button>
        <button id="pourWater" onClick={pourWater}> Pour Water</button>
        <label id="notice">Water Level</label>
        <button id="waterLevel" disabled="true"> {waterLevel} </button>
        <button id="checkWaterlevel" onClick={getWaterLevel}> check water level</button>
    </div>
  );
}

export default App;