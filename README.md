# Basic HashedPersona demo

This code is from the Tutorial [Build your own NFT Marketplace from Scratch](https://docs.alchemy.com/alchemy/) built by [alchemy.com](https://alchemy.com)

To deploy and verify smart contract:
Add your ethscan api key in hardhat.config.js
      goerli: 'YOUR KEY'
      
Then run the following commands:
```bash
npm install --save-dev @nomiclabs/hardhat-etherscan
npx hardhat run --network goerli scripts/deploy.js
npx hardhat verify --network goerli 0x15281232261a4234118dd6d91D1E0E6a1600b558
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
