// require('babel-register');
// require('babel-polyfill');
// require('dotenv').config();
// const fs= require('fs');
// const provider= require('@truffle/hdwallet-provider');

// const secrets= JSON.parse(fs.readFileSync('.secrets.json').toString().trim());

// module.exports = {
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 9545,
//       network_id: "*" // Match any network id
//     },
//     kovan:{
//       provider:()=>{
//         return new provider(
//           secrets.privateKeys,
//           secrets.infuraUrl,
//           0,
//           1
//         )
//       },
//       network_id:42
//     }
   
//   },
//   contracts_directory: './src/contracts/',
//   contracts_build_directory: './src/abis/',
//   compilers: {
//     solc: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   }
// }


// *********************

require('babel-register');
require('babel-polyfill');
const fs= require('fs');
const provider= require('@truffle/hdwallet-provider');

const secrets= JSON.parse(fs.readFileSync('.secrets.json').toString().trim());


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    kovan:{
      provider:()=>{
        return new provider(
          secrets.privateKeys,
          secrets.infuraUrl,
          0,
          1
        )
      },
      network_id:42
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
