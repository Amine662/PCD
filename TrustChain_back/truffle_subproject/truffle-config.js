require('dotenv').config();
const { MNEMONIC, PRIVATE_KEY /*, MEGAETH_API_KEY */ } = process.env;
const HDWalletProvider = require('@truffle/hdwallet-provider');

// ** IMPORTANT ** Replace placeholders below with actual MegaETH details!
const MEGAETH_RPC_URL = "https://carrot.megaeth.com/rpc";
const MEGAETH_CHAIN_ID = "6342";

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a managed Ganache instance for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Local development network (Ganache, etc.)
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Standard Ethereum port
      network_id: "*"       // Any network
    },

    // MegaETH custom network using HDWalletProvider
    megaeth: {
      provider: () => new HDWalletProvider(
        MNEMONIC || PRIVATE_KEY,
        MEGAETH_RPC_URL
      ),
      network_id: Number(MEGAETH_CHAIN_ID), // Chain ID of MegaETH
      confirmations: 2,    // # of confirmations to wait between deployments
      timeoutBlocks: 200,  // # of blocks before a deployment times out
      skipDryRun: true     // Skip dry run before migrations
      // gasPrice, gas, etc. can be added if MegaETH recommends
    }
  },

  // Mocha options (if you need custom settings)
  mocha: {
    // timeout: 100000
  },

  // Compiler configuration
  compilers: {
    solc: {
      version: "0.8.21",   // Fetch exact version from solc-bin
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
