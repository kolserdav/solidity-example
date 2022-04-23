// @ts-check
// eslint-disable-next-line no-unused-vars
import Web3, { Modules } from "web3";
import Web3Modal from "web3modal";
import './App.css';
import NFT from  './contracts/NFT.json';

/**
 * @type {any}
 */
const { abi, networks } = NFT;
const { address } = networks["5777"];
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

  /**
   * Сохраняет кошелек
   * @param {string[]} accounts 
   */
  function saveAccounts(accounts){
    if (accounts?.length !== 0) {
      alert(`Wallet connected ${JSON.stringify(accounts)}`);
      window.localStorage.setItem(WALLET_LOCAL_STORAGE_NAME, JSON.stringify(accounts));
    } else {
      alert('Wallet not connected');
    }
  }

  /**
   * Прослушиватель нажатия на Метамаск
   */
  async function connectToMetamask() {
    let accounts;
    const { ethereum } = window;
    // Если подключение к расширению браузера
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    saveAccounts(accounts);
  }

  /**
   * Создание токена
   */
  async function mint() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    if (acc[0]) {
      const value = prompt('Контент NFT');
      const { contract, web3 } = await getContext();
      // Подписывается на событие
      contract.once('Transfer', {}, (error, event) => {
        if (error) {
          console.error(error);
          return;
        }
        console.info('Event transfer', event);
      })
      // Записывает в блокчейн
      contract.methods.mint(value).send({from: acc[0], value: web3.utils.toWei('0.001' ,"ether")})
        .on('receipt', function(){
          // Когда транзакция прошла получает из блокчейна
          console.info('Токен создан');
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
   * Передача токена другому кошельку
   * TODO добавить оплату
   */
   async function transferFrom() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    const { contract, web3 } = await getContext();
    contract.once('Transfer', {}, (error, event) => {
      console.info('Event transfer', error, event);
    });
    contract.methods.transferFrom(acc[0], '0x4212A485A7aD43192139d054544fBC3fC806CFc1', 1).send({from: acc[0] })
      .then (function(d){
          alert(`Результат: ${JSON.stringify(d)}`);
      });
  }

  /**
   * Получить токены пользователя
   */
   async function getUserTokens() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    const { contract } =  await getContext();
    contract.methods.getUserTokens(acc[0]).call({from: acc[0]})
      .then(function(d){
          alert(`Мои токены: ${JSON.stringify(d)}`);
      });
  }

  return (
    <div className="App">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={connectToMetamask}>connectToMetamask</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={mint}>mint</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={balanceOf}>balanceOf</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={getUserTokens}>getMyTokens</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={transferFrom}>transferFrom</button>
    </div>
  );
}

export default App;
