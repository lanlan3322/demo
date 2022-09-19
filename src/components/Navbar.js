import fullLogo from '../HashedPersonaDark.png';
import {
  Link
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar() {

//const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
}

function updateButton() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  ethereumButton.textContent = "Connected";
  ethereumButton.classList.remove("hover:bg-blue-70");
  ethereumButton.classList.remove("bg-blue-500");
  ethereumButton.classList.add("hover:bg-green-70");
  ethereumButton.classList.add("bg-green-500");
}

async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0x5')
    {
      //alert('Incorrect network! Switch your metamask network to Goerli');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
     })
    }  
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        getAddress();
        window.location.replace(location.pathname)
      });
}

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if(val)
    {
      getAddress();
      //toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', accounts => {
      console.log("accountsChanged",currAddress);
      window.location.replace(location.pathname)
    })
  });

    return (
      <div className="">
        <nav className="w-screen">
          <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
            <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
            <div className='inline-block font-bold text-xl ml-2'>
              HashedPersona
            </div>
            </Link>
          </li>
          <li className='w-full'>
            <ul className='lg:flex justify-between font-bold text-lg'>
              {location.pathname === "/" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/">All Collections</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/">All Collections</Link>
              </li>              
              }
              {location.pathname === "/HPnew" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/HPnew">Add Collection</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/HPnew">Add Collection</Link>
              </li>              
              }              
              {location.pathname === "/HPcollection" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/HPcollection">My Collection</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/HPcollection">My Collection</Link>
              </li>              
              }  
              {location.pathname === "/HPcards" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/HPcards">My HPCards</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/HPcards">My HPCards</Link>
              </li>              
              }  
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded text-sm p-1" onClick={connectWebsite}></button>
              </li>
            </ul>
          </li>
          </ul>
        </nav>
        <div className='text-white text-bold text-right mr-10 text-sm'>
          {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? currAddress:""}
        </div>
      </div>
    );
  }

  export default Navbar;