// @ts-check
import { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Web3, { Modules } from "web3";
import Web3Modal from "web3modal";
import abiDecoder from 'abi-decoder';
import './App.css';
import NFT from  './contracts/NFT.json';

/**
 * @type {any}
 */
const { abi, networks } = NFT;
const { address } = networks["5777"];
console.log(address)
const WALLET_LOCAL_STORAGE_NAME = 'wal';

/**
 * 
 * @returns {Promise<{
 *  web3: Web3;
 *  contract: ReturnType<Modules['Eth']>['Contract'];
 * }>}
 */
async function getContext() {
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
   const web3 = new Web3(provider)

   return {
     web3,
     contract: new web3.eth.Contract(abi, address)
   }
}

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
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    if (acc[0]) {
      const value = prompt('Контент NFT');
      const { contract } = await getContext();
      // Подписывается на событие
      contract.once('Transfer', {}, (error, event) => {
        console.log('Event transfer');
      })
      // Записывает в блокчейн
      contract.methods.mint(value).send({from: acc[0]})
        .on('receipt', function(){
          // Когда транзакция прошла получает из блокчейна
          console.log('Токен создан');
        });
    }
  }

  /**
   * Получить количество токенов на кошельке
   */
  async function balanceOf() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    const { contract } =  await getContext();
    contract.methods.balanceOf(acc[0]).call({from: acc[0]})
      .then(function(d){
          alert(`Токенов: ${d}`);
      });
  }

  /**
   * Получить количество оставашихся токенов на контракте
   */
   async function getApproved() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    const { contract } =  await getContext();
    contract.methods.getApproved(1).call({from: acc[0]})
      .then(function(d){
          alert(`Осталось токенов: ${d}`);
      });
  }

  /**
   * Получить токены пользователя
   */
   async function getUserTokens() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    const { contract } =  await getContext();
    contract.methods.safeTransferFrom(acc[0], '0x4212A485A7aD43192139d054544fBC3fC806CFc1', 3).call({from: acc[0]})
      .then(function(d){
          alert(`Трансферт токенов: ${JSON.stringify(d)}`);
      });
  }


  useEffect(() => {
   console.log('startZ')
  }, []);

  return (
    <div className="App">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={connectToMetamask}>connectToMetamask</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={start}>mint</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={balanceOf}>balanceOf</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={getUserTokens}>getMyTokens</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={getApproved}>getApproved</button>
    </div>
  );
}

export default App;
