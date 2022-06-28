import './styles/App.css';
import linkedin from './assets/LinkedIn_Logo.svg';
import React , { useEffect, useState } from "react";
import { ethers } from 'ethers';
import myEpicNft from './utils/MyEpicNFT.json'

// Constants




const TWITTER_HANDLE = 'tushit-verma-970451114';
const TWITTER_LINK = `https://www.linkedin.com/in/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';

const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () =>{
    const { ethereum } = window;

    if(!ethereum) {
      console.log("make sure you have metamask");
      return;

    } else {
      console.log("ethereum object found", ethereum);
    }
  

  const accounts = await ethereum.request({method: 'eth_accounts'});

  if (accounts.lenght !== 0) {
    const account = accounts[0];
    console.log("found and authorised account", account);
    setupEventListener()
  } else {
    console.log("No authorised account found");
  }
}

const connectWallet = async () =>{
  try {
    const { ethereum } = window;
    if(!ethereum) {
      alert ("Please install metamask");
      return;
    } 
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});

    console.log("connected" , accounts[0]);
    setCurrentAccount(accounts[0]);
    setupEventListener()
    
    
  } catch (error) {
    console.log(error);
    
  }

}

const setupEventListener = async () => {
  const CONTRACT_ADDRESS = "0x56db9539314E91427178A03c2E699C0a5Bbb60ac";
  // Most of this looks the same as our function askContractToMintNft
  try {
    const { ethereum } = window;

    if (ethereum) {
      // Same stuff again
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      // THIS IS THE MAGIC SAUCE.
      // This will essentially "capture" our event when our contract throws it.
      // If you're familiar with webhooks, it's very similar to that!
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      });

      console.log("Setup event listener!")

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "0x56db9539314E91427178A03c2E699C0a5Bbb60ac";
  try {
    const { ethereum } = window;
    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now");
      let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("mining Pls Wait");
      await nftTxn.wait();
      const hash = nftTxn.hash;
      console.log('Mined, See transaction: https://rinkeby.etherscan.io/tx/' + hash);
    } else {
      console.log("ethereum object not found");
    }
    } catch (error) {
      console.log(error);
    
  }
}
  
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
   }, [])
  

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === ""
          ? renderNotConnectedContainer()
          : (
            <button onClick={askContractToMintNft} className = "cta-button mint-button ">
              Mint NFT
            </button>
            
          )
          }
          <div>
            <br></br>
          </div>
           
          

          {/* <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div> */}

        </div>
        <div className="footer-container">
          {/* <img alt="linkedin Logo" className="twitter-logo" src={linkedin} /> */}
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Follow me: @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
