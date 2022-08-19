import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        twitter: meta.twitter,
        linkedin: meta.linkedin,
        email: meta.email,
   }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Following the 301NFT... Please Wait (Up to 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully followed the 301NFT!');
        updateMessage("");
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
        <div style={{"min-height":"100vh"}}>
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
                        Price: <span className="">{data.price + " ETH"}</span>
                        </p>
                    <p className="display-inline">
                        Issuer: <span className="text-sm">{data.owner}</span>
                        </p>
                    <p className="display-inline">
                        Owner: <span className="text-sm">{data.seller}</span>
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
                    <div>
                        { currAddress !== data.owner ?
                            "Total Roylty Earned from this 301NFT: "+data.price + "ETH"
                            : "You are not following this 301NFT"
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
                        Level: <span className="">{data.price}</span>
                        </p>
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
                            Level: <span className="">{data.price}</span>
                            </p>
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
                            Level: <span className="">{data.price}</span>
                            </p>
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
                            Level: <span className="">{data.price}</span>
                            </p>
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
                            Level: <span className="">{data.price}</span>
                            </p>
                    </div>
                    <hr/>
                    <div>
                        { currAddress === data.owner ?
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Follow</button>
                            : <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Unfollow</button>
                        }
                        
                        <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}