// @ts-check
import { useEffect } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import './App.css';
import NFT from  './artifacts/contracts/NFT.sol/NFT.json';

/**
 * @type {any}
 */
const { abi } = NFT;
let contract = {};
const WALLET_LOCAL_STORAGE_NAME = 'wal';
const CONTRACT = '0xB98d3E04B6A2d9C947718673999CC4Ffc9a9a495'

function App() {

  function saveAccounts(accounts){
    // Если получены номера аккаунтов
    if (accounts?.length !== 0) {
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
    accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    // Если получены номера аккаунтов
    saveAccounts(accounts);
  }

  async function start() {
    const providerOptions = {
     test: {
      package: '',
      options: [],
      connector: async () => {},
      display: {}
     }
    };
    
    const web3Modal = new Web3Modal({
      network: "http://127.0.0.1:7545", // optional
      cacheProvider: true, // optional
      providerOptions
    });
    
    const provider = await web3Modal.connect();
    const web = new Web3(provider)

    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    // Баланс кошелька
    console.log(web.utils.fromWei(await web.eth.getBalance(acc[0]), 'ether'));

    contract = new web.eth.Contract(abi, CONTRACT)
    if (acc[0]) {
      const value = prompt('Контент NFT');
      // Записывает в блокчейн
      contract.methods.mint(value).send({from: acc[0]})
        .on('receipt', function(){
          // Когда транзакция прошла получает из блокчейна
          alert('Токен создан');
        });
    }
  }

  function getCountTokens() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    contract.methods.balanceOf().call({from: acc[0]})
      .then(function(d){
          alert(`Остаток токенов: ${d}`);
      });
  }

  function getUserCountTokens() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    contract.methods.getUserCountTokens().call({from: acc[0]})
      .then(function(d){
          alert(`У меня токенов: ${d}`);
      });
  }

  useEffect(() => {
   console.log('startZ')
  }, []);

  return (
    <div className="App">
      <button onClick={connectToMetamask}>connectToMetamask</button>
      <button onClick={start}>mint</button>
      <button onClick={getCountTokens}>getCountTokens</button>
      <button onClick={getUserCountTokens}>getUserCountTokens</button>
    </div>
  );
}

export default App;
