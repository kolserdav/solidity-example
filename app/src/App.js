// @ts-check
import { useEffect } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import './App.css';

const WALLET_LOCAL_STORAGE_NAME = 'wal';

/**
 * @type {any}
 */
const abi =  [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

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

    // подключился к контракту
    const contract = new web.eth.Contract(abi, "0xC5908357a54cEFD7bec7C86023396B9E53c04C6c")
    // Установил приветствие
    const value = prompt('Новое приветствие');
    // Записывает в блокчейн
    contract.methods.setGreeting(value).send({from: acc[0]})
      .on('receipt', function(){
        // Когда транзакция прошла получает из блокчейна
        contract.methods.greet().call({from: acc[0]})
        .then(function(d){
            alert(`Новое приветствие: ${d}`);
        });
      });
  }

  useEffect(() => {
   start();
  }, []);

  return (
    <div className="App">
      <button onClick={connectToMetamask}>connectToMetamask</button>
    </div>
  );
}

export default App;
