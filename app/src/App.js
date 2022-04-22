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
        console.log(parseTransaction(event.transactionHash));
      })
      // Записывает в блокчейн
      contract.methods.mint(value).send({from: acc[0]})
        .on('receipt', function(){
          // Когда транзакция прошла получает из блокчейна
          alert('Токен создан');
        });
    }
  }

  /**
   * 
   * @param {string} transaction 
   * @returns 
   */
  async function parseTransaction(transaction) {
    const { web3 } = await getContext();
    const tx = await web3.eth.getTransactionReceipt(transaction);
    console.log(2, tx)
    const decodedInput = abiDecoder.decodeMethod(tx.logs);
    console.log(decodedInput);
    return {
        function_name: decodedInput.name,
        from: tx.from,
        to: decodedInput.args[0],
        erc20Value: Number(decodedInput.args[1])
    }; 
  }

  /**
   * Получить количество токенов на кошельке
   */
  async function getCountTokens() {
    const acc = JSON.parse(window.localStorage.getItem(WALLET_LOCAL_STORAGE_NAME));
    const { contract } =  await getContext();
    contract.methods.balanceOf(acc[0]).call({from: acc[0]})
      .then(function(d){
          alert(`Токенов: ${d}`);
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
          alert(`Мои токены: ${d}`);
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
      <button onClick={getUserTokens}>getMyTokens</button>
    </div>
  );
}

export default App;
