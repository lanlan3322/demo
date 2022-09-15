# Basic HashedPersona demo

This code is from the Tutorial [Build your own NFT Marketplace from Scratch](https://docs.alchemy.com/alchemy/) built by [alchemy.com](https://alchemy.com)

To deploy and verify smart contract:
Add your ethscan api key in hardhat.config.js
      goerli: 'YOUR KEY'
      
Then run the following commands:
```bash
npm install --save-dev @nomiclabs/hardhat-etherscan
npx hardhat run --network goerli scripts/deploy.js
npx hardhat verify --network goerli 0x7514E3Cd9CF8556199464B007e6894C3E9FF0393
```

To set up the repository and run the HashedPersona locally:
```bash
git clone https://github.com/HashedPersona/demo
cd demo
npm install
npm start
```

Testing:
https://monumental-faloodeh-f4fcee.netlify.app/
