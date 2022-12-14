import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import HashedPersonaJSON from '../HashedPersona.json'
import axios from 'axios'
import { useState } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata'

export default function HPedit() {
  const [data, updateData] = useState({})
  const [dataFetched, updateDataFetched] = useState(false)
  const [message, updateMessage] = useState('')
  const [formParams, updateFormParams] = useState({
    name: '',
    description: '',
    amount: '',
    twitter: '',
    linkedin: '',
    email: '',
  })
  const [fileURL, setFileURL] = useState(null)
  const ethers = require('ethers')

  async function getNFTData(tokenId) {
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
    const listedToken = await contract.getListedTokenForId(tokenId)
    const collectionId = await contract.getCollectionIdFromTokenId(tokenId)
    const listedCollection = await contract.getCollectionForId(collectionId)
    const tokenURI = listedCollection.collectionURI
    let meta = await axios.get(tokenURI)
    meta = meta.data
    let currentStatus = 'Disabled'
    //console.log(listedToken);
    switch (listedToken.tokenStatus) {
      case 1:
        currentStatus = 'Active'
        break
      default:
        currentStatus = 'Disabled'
        break
    }

    let item = {
      collectionId: collectionId,
      issuer: listedCollection.issuer,
      image: meta.image,
      name: meta.name,
      description: meta.description,
      twitter: meta.twitter,
      linkedin: meta.linkedin,
      email: meta.email,
      amount: listedCollection.maxSupply,
      claimed: listedCollection.numClaimed,
      status: currentStatus,
    }
    updateData(item)
    updateDataFetched(true)
    //console.log(item);
  }

  const params = useParams()
  const tokenId = params.tokenId
  if (!dataFetched) getNFTData(tokenId)
  console.log(data);

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0]
    //check for file extension
    try {
      //upload the file to IPFS
      console.log('Uploaded file to Pinata start: ')
      const response = await uploadFileToIPFS(file)
      if (response.success === true) {
        console.log('Uploaded image to Pinata: ', response.pinataURL)
        setFileURL(response.pinataURL)
      }
    } catch (e) {
      console.log('Error during file upload', e)
    }
  }

  //This function uploads the metadata to IPDS
  async function uploadMetadataToIPFS() {
    const { name, description, amount, twitter, linkedin, email } = formParams
    //console.log('formParams: ', formParams)

    const nftJSON = {
      name,
      description,
      amount,
      twitter,
      linkedin,
      email,
      image: fileURL,
    }
    console.log('nftJSON: ', nftJSON)
    //Make sure that none of the fields are empty
    if (
      !name ||
      !description ||
      !amount ||
      !fileURL ||
      !twitter ||
      !linkedin ||
      !email
    ) {
      console.log('nftJSON: ', nftJSON)
      return
    }

    try {
      console.log('Uploaded JSON to Pinata start: ', nftJSON)
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON)
      if (response.success === true) {
        console.log('Uploaded JSON to Pinata successful: ', response)
        return response.pinataURL
      }
    } catch (e) {
      console.log('error uploading JSON metadata:', e)
    }
  }

  async function listNFT(e) {
    e.preventDefault()

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS()
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      updateMessage('Please wait.. uploading (up to 5 mins)')
      document.getElementById('nftForm').style.display = 'none'

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        HashedPersonaJSON.address,
        HashedPersonaJSON.abi,
        signer,
      )

      //massage the params to be sent to the create NFT request
      //const amount = ethers.utils.parseUnits(formParams.amount, 'ether')
      //let listingPrice = await contract.getListPrice()
      //listingPrice = listingPrice.toString()
      //const amount = formParams.amount

      //actually create the NFT
      //console.log('metadataURL', metadataURL)
      //console.log('amount', amount)
      let transaction = await contract.setCollectionURI(metadataURL, data.collectionId)
      await transaction.wait()

      alert('Successfully updated your NFT!')
      updateMessage('')
      updateFormParams({
        name: '',
        description: '',
        amount: '',
        twitter: '',
        linkedin: '',
        email: '',
      })
      window.location.replace('/')
    } catch (e) {
      alert('Upload error' + e)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Update your Hashed Persona
          </h3>
          <img
            src={data.image}
            alt=""
            className="w-20 rounded-lg object-cover place-items-center"
          />
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Your Hashed Persona Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder={data.name}
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Your Hashed Persona Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder={data.description}
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="twitter"
            >
              Twitter
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="twitter"
              type="text"
              placeholder={data.twitter}
              value={formParams.twitter}
              onChange={(e) =>
                updateFormParams({ ...formParams, twitter: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="linkedin"
            >
              LinkedIn
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="linkedin"
              type="text"
              placeholder={data.linkedin}
              value={formParams.linkedin}
              onChange={(e) =>
                updateFormParams({ ...formParams, linkedin: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder={data.email}
              value={formParams.email}
              onChange={(e) =>
                updateFormParams({ ...formParams, email: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder={data.amount}
              step="1"
              value={formParams.amount}
              onChange={(e) =>
                updateFormParams({ ...formParams, amount: e.target.value })
              }
            ></input>
          </div>
          <div>
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <input type={'file'} onChange={OnChangeFile}></input>
          </div>
          <br>
          </br>
          <button
            onClick={listNFT}
            className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
          >
            Update Hashed Persona
          </button>
        </form>
      </div>
      <div className="text-green text-center">{message}</div>
    </div>
  )
}
