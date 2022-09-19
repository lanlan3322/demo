import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import HashedPersonaJSON from "../HashedPersona.json";
import axios from "axios";
import { useState } from "react";

export default function HPdetails (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");
const [collected, updateCollected] = useState(false);

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(HashedPersonaJSON.address, HashedPersonaJSON.abi, signer)
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    const isCollected = await contract.isCollected(tokenId, addr);
    updateCollected(isCollected);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    let currentStatus = "Disabled";
    //console.log(listedToken);
    switch(listedToken.tokenStatus){
        case 1:
            currentStatus = "Active";
            break;
        default:
            currentStatus = "Disabled";
            break;
    }

    let item = {
        price: meta.price,
        tokenId: tokenId,
        issuer: listedToken.issuer,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        twitter: meta.twitter,
        linkedin: meta.linkedin,
        email: meta.email,
        amount: listedToken.amount,
        status: currentStatus,
   }
    //console.log(item);
    updateData(item);
    updateDataFetched(true);
    //console.log("address", addr)
    updateCurrAddress(addr);
}

async function follow(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(HashedPersonaJSON.address, HashedPersonaJSON.abi, signer);
        //const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Following the Hashed Persona... Please Wait (Up to 5 mins)")
        //run the collect function
        console.log("tokenId", tokenId);
        let transaction = await contract.collect(tokenId);
        await transaction.wait();

        alert(transaction?'You successfully followed this Hashed Persona!':'You are trying to follow the same Hashed Persona more than once!');

        updateMessage("");
        window.location.replace("/")
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}
async function unfollow(tokenId) {
    try {
        alert('You successfully unfollowed the Hashed Persona!');
        updateMessage("");
        window.location.replace("/")
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}
async function edit(tokenId) {
    try {
        alert('You successfully updated the Hashed Persona!');
        updateMessage("");
        window.location.replace("/")
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}
async function toggleFeature() {
    try {
        alert('You successfully toggled feature for this Hashed Persona Card!');
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}
    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return(
        <div style={{"minHeight":"100vh"}}>
            <Navbar></Navbar>
            <div className="flex ml-20 mt-20">
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <img src={data.image} alt="" className="w-72 h-80 rounded-lg object-cover" />
                    <p className="display-inline">
                        Name: {data.name}
                    </p>
                    <p className="display-inline">
                        Description: {data.description}
                    </p>
                    <p className="display-inline">
                        Total: <span className="">{data.amount + " ETH"}</span>
                        </p>
                    <p className="display-inline">
                        Issuer: <span className="text-sm">{data.issuer}</span>
                        </p>
                    <p className="display-inline">
                        Owner: <span className="text-sm">{data.owner}</span>
                        </p>
                    <p className="display-inline">
                        Twitter: <span className="">{data.twitter}</span>
                        </p>
                    <p className="display-inline">
                        LinkedIn: <span className="text-sm">{data.linkedin}</span>
                        </p>
                    <p className="display-inline">
                        Email: <span className="text-sm">{data.email}</span>
                    </p>
                    <hr/>
                    <p className="display-inline">
                        Status: <span className="text-sm">{data.status}</span>
                    </p>
                    <hr/>
                    <div>
                        { currAddress !== data.issuer ?
                            currAddress !== data.owner && !collected ?
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => follow(tokenId)}>Follow</button>
                            : <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => unfollow(tokenId)}>Unfollow</button>

                            : <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => edit(tokenId)}>Edit</button>
                        }
                        <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        <strong className="text-xl">Features1</strong>
                        <p className="display-inline">
                        Name: {data.name}
                        </p>
                        <p className="display-inline">
                        Description: {data.description}
                        </p>
                        <p className="display-inline">
                        Level: <span className="">1</span>
                        </p>
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => toggleFeature()}>Add</button>
                    </div>
                    <hr/>
                    <div>
                        <strong className="text-xl">Features2</strong>
                        <p className="display-inline">
                            Name: {data.name}
                            </p>
                            <p className="display-inline">
                            Description: {data.description}
                            </p>
                            <p className="display-inline">
                            Level: <span className="">2</span>
                            </p>
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => toggleFeature()}>Add</button>
                    </div>
                    <hr/>
                    <div>
                        <strong className="text-xl">Features3</strong>
                        <p className="display-inline">
                            Name: {data.name}
                            </p>
                            <p className="display-inline">
                            Description: {data.description}
                            </p>
                            <p className="display-inline">
                            Level: <span className="">8</span>
                            </p>
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => toggleFeature()}>Add</button>
                    </div>
                    <hr/>
                    <div>
                        <strong className="text-xl">Features4</strong>
                        <p className="display-inline">
                            Name: {data.name}
                            </p>
                            <p className="display-inline">
                            Description: {data.description}
                            </p>
                            <p className="display-inline">
                            Level: <span className="">10</span>
                            </p>
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => toggleFeature()}>Add</button>
                    </div>
                    <hr/>
                    <div>
                        <strong className="text-xl">Features5</strong>
                        <p className="display-inline">
                            Name: {data.name}
                            </p>
                            <p className="display-inline">
                            Description: {data.description}
                            </p>
                            <p className="display-inline">
                            Level: <span className="">100</span>
                            </p>
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => toggleFeature()}>Add</button>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
    )
}