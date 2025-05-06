require('dotenv').config();
const { MNEMONIC, PRIVATE_KEY} = process.env;
const HDWalletProvider = require('@truffle/hdwallet-provider');
const MEGAETH_RPC_URL = "https://carrot.megaeth.com/rpc";
const MEGAETH_CHAIN_ID = "6342";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  
      port: 7545,            
      network_id: "*"       
    },
    megaeth: {
      provider: () => new HDWalletProvider(
        MNEMONIC || PRIVATE_KEY,
        MEGAETH_RPC_URL
      ),
      network_id: Number(MEGAETH_CHAIN_ID), 
      confirmations: 2,    
      timeoutBlocks: 200,  
      skipDryRun: true  
    }
  },
  mocha: {
  },
  compilers: {
    solc: {
      version: "0.8.21",  
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  }
};
