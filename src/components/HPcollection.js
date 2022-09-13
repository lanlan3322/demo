import Navbar from "./Navbar";
import { useParams } from 'react-router-dom';
import HashedPersonaJSON from "../HashedPersona.json";
import axios from "axios";
import { useState } from "react";
import HPthumbnail from "./HPthumbnail";

export default function HPcollection () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [addressConnected, updateAddress] = useState("0x");
    //const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        //let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(HashedPersonaJSON.address, HashedPersonaJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyCollections(addr)

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyCollections() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            //let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price: meta.price,
                tokenId: i.tokenId,
                issuer: i.issuer,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                twitter: meta.twitter,
                linkedin: meta.linkedin,
                email: meta.email,
                amount: i.amount,
                currAddress: addr,
            }
            //sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        //updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return (
        <div className="profileClass" style={{"minHeight":"100vh"}}>
            <Navbar></Navbar>
            <div className="profileClass">
            <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                <div className="mb-5">
                    <h2 className="font-bold">My Wallet Address</h2>  
                    {addressConnected}
                </div>
            </div>
            <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                    <div className="ml-20">
                        <h2 className="font-bold">Total Hashed Persona Collections</h2>
                        {data.length}
                    </div>
            </div>
            <div className="flex flex-col text-center items-center mt-11 text-white">
                <h2 className="font-bold">Your Hashed Persona Collections</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {data.map((value, index) => {
                    return <HPthumbnail data={value} key={index}></HPthumbnail>;
                    })}
                </div>
                <div className="mt-10 text-xl">
                    {data.length === 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
                </div>
            </div>
            </div>
        </div>
    )
};