const HashedPersona =  require("../src/HashedPersona.json");
async function getNFts () {
const MyContract = await ethers.getContractFactory("HashedPersona");
const contract = await MyContract.attach(
  HashedPersona.address
);

// Now you can call functions of the contract
var vals = await contract.getListPrice();
console.log(vals);

/*const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();
const addrsign = await signer.getAddress();

let contract = new ethers.Contract(HashedPersona.address, HashedPersona.abi, signer)
let transaction = await contract.getAllNFTs()
console.log(transaction);*/
}

getNFts();


