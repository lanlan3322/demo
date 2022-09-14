import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import HashedPersona from '../HashedPersona.json';

export default function HPnew () {
    const [formParams, updateFormParams] = useState({ name: '', description: '', amount: '', twitter: '', linkedin: '', email: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    //const location = useLocation();

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            console.log("Uploaded file to Pinata start: ")
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPDS
    async function uploadMetadataToIPFS() {
        const {name, description, amount, twitter, linkedin, email} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !amount || !fileURL || !twitter || !linkedin || !email)
            return;

        const nftJSON = {
            name, description, amount, twitter, linkedin, email, image: fileURL
        }

        try {
            console.log("Uploaded JSON to Pinata start: ", nftJSON)
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata successful: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (up to 5 mins)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(HashedPersona.address, HashedPersona.abi, signer)

            //massage the params to be sent to the create NFT request
            //const amount = ethers.utils.parseUnits(formParams.amount, 'ether')
            //let listingPrice = await contract.getListPrice()
            //listingPrice = listingPrice.toString()
            const amount = formParams.amount

            //actually create the NFT
            console.log("metadataURL", metadataURL);
            console.log("amount", amount);
            let transaction = await contract.createTokenCollection(metadataURL, amount)
            await transaction.wait()

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', amount: '', twitter: '', linkedin: '', email: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    console.log("Working", process.env);
    return (
        <div className="">
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-purple-500 mb-8">Create your Hashed Persona</h3>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">Your Hashed Persona Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Hashed Persona" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">Your Hashed Persona Description</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Hashed Persona Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="twitter">Twitter</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="twitter" type="text" placeholder="Hashed Persona Collection" value={formParams.twitter} onChange={e => updateFormParams({...formParams, twitter: e.target.value})}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="linkedin">LinkedIn</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="linkedin" type="text" placeholder="Hashed Persona Collection" value={formParams.linkedin} onChange={e => updateFormParams({...formParams, linkedin: e.target.value})}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Hashed Persona Collection" value={formParams.email} onChange={e => updateFormParams({...formParams, email: e.target.value})}></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="amount">Amount</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 1" step="1" value={formParams.amount} onChange={e => updateFormParams({...formParams, amount: e.target.value})}></input>
                </div>
                <div>
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-green text-center">{message}</div>
                <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                    Create Hashed Persona
                </button>
            </form>
        </div>
        </div>
    )
}