import { useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import logo from './logo.svg';
import './App.css';

const providerUrl = 'https://mainnet.infura.io/v3/cab3253649344bdc8709512c85be0c21';
const WALLET_LOCAL_STORAGE_NAME = 'wal';

function App() {

  useEffect(() => {
    const metamask = document.querySelector('#metamask');
    const mfpClose = document.querySelector('.mfp-close');
    function saveAccounts(accounts){
      // Если получены номера аккаунтов
      if (accounts?.length !== 0) {
        mfpClose.click();
        alert(`Wallet connected ${JSON.stringify(accounts)}`);
        window.localStorage.setItem(WALLET_LOCAL_STORAGE_NAME, JSON.stringify(accounts));
      } else {
        alert('Wallet not connected');
        // TODO вывод что кошелек не найден
      }
    }
    /**
     * Прослушиватель нажатия на Метамаск
     */
    async function connectToMetamask() {
      let accounts;
      const { ethereum } = window;
      // Если подключение к расширению браузера
      if (ethereum?.isMetaMask) {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        // Если подключение к мобильному устройству
        const provider = new WalletConnectProvider({
          rpc: {
            1: providerUrl,
          },
        });
        accounts = await provider?.enable();
      }
      /*
       TODO ...
       const NFT = new web3.eth.Contract(NFT_ABI, ac6);
      const txData = NFT.methods.create(1, 'fileHash', 'pdfHash').encodeABI();
      web3.eth.sendTransaction(
        {
          to: ac6,
          from: accounts[0],
          data: txData,
          value: web3.utils.toWei('0.3', 'ether'),
        },
        (error, res) => {
          console.log(1, error);
          console.log(2, res);
        }
      );
      const balance = await web3.eth.getBalance(ac6);
      console.log(web3.utils.fromWei(balance, 'ether' ))
      */
      // Если получены номера аккаунтов
      saveAccounts(accounts);
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
