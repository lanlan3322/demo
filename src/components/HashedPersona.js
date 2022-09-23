import Navbar from './Navbar'
import HPthumbnail from './HPthumbnail'
import HashedPersonaJSON from '../HashedPersona.json'
import axios from 'axios'
import { useState } from 'react'

export default function HashedPersona() {
  const sampleData = [
    {
      name: 'Hashed Persona demo',
      description: 'Hashed Persona demo',
      website: 'https://HashedPersona.io',
      image:
        'https://gateway.pinata.cloud/ipfs/Qmen8s68vcXqYkH12uxCNLAGCm4XFCBUAUVZWaYbjipUMj',
      amount: '0',
      twitter: '@HashedPersona',
      linkedin: 'HashedPersonalinkedin',
      email: 'HashedPersona@HashedPersona.io',
      status: '1',
      address: '0x8DEc285B11c335d1C7b5E7Bf7139f9c0c9C78132',
    },
  ]
  const [data, updateData] = useState(sampleData)
  const [dataFetched, updateFetched] = useState(false)

  async function getAllCollections() {
    const ethers = require('ethers')
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const addr = await signer.getAddress()
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      HashedPersonaJSON.address,
      HashedPersonaJSON.abi,
      signer,
    )
    //create an NFT Token
    const transaction = await contract.getAllCollections()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId)
        let meta = await axios.get(tokenURI)
        meta = meta.data
        const collected = await contract.getCollectedAmountFromTokenId(
          i.tokenId,
        )

        //console.log(meta);
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
          total: meta.amount,
          collected: collected,
          currAddress: addr,
        }
        return item
      }),
    )
    //console.log("items.length",items.length);

    updateFetched(true)
    updateData(items)
  }

  if (!dataFetched) getAllCollections()

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">
          Hashed Persona Collections
        </div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.length ? (
            data.map((value, index) => {
              return <HPthumbnail data={value} key={index}></HPthumbnail>
            })
          ) : (
            <div className="md:text-xl font-bold text-white">
              No collection found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
