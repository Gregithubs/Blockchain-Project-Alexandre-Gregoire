import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { Contract, providers, utils } from "ethers";
import { nftMarketplaceAddress, nftTokenAddress, nftTokenABI, nftMarketplaceABI } from '../../config';
import styles from '../styles/Home.module.css'

// setup ipfs

const projectId = '2EFj7DtitfH0sFAKhMQzVVudPLV';
const projectSecret = '5d151117c25f83917606d2968f996869';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default function createItem() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [accountAddress, setAccountAddress] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const [mintedNFTtx, setMintedNFTtx] = useState(undefined)
  const router = useRouter()


  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      })
    }
  }, [walletConnected])


  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      );
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url)
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }
  async function createItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name, description, image: fileUrl
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (e) {
      console.log(e);
    }
  }
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const accounts = await web3Provider.listAccounts()
    console.log(accounts[0])
    setAccountAddress(accounts[0])
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  async function createSale(url) {
    try {
      const signer = await getProviderOrSigner(true);
      let contract = new ethers.Contract(nftTokenAddress, nftTokenABI, signer);
      let transaction = await contract.mintNFTs(url);
      let tx = await transaction.wait();
      console.log(tx)
      setMintedNFTtx(tx)
    } catch (error) {
      console.log(error)
    }
  }


  async function listNFT() {
    console.log(mintedNFTtx)
    const signer = await getProviderOrSigner(true);
    let contract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    let royalty = await contract.getRoyalty();
    royalty = royalty.toString();
    let event = mintedNFTtx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');
    let transaction = await contract.listNftInMarket(nftTokenAddress, tokenId, price, { value: royalty });
    await transaction.wait();
    router.push('/');
  }

  return (
    <div className='flex justify-center pb-40'>
      <div className='w-full flex flex-col pb-40'>
        <input placeholder='NFT Name' className='mt-8 border rounded p-4' onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
        <textarea placeholder='NFT Description' className='mt-8 border rounded p-4' onChange={e => updateFormInput({ ...formInput, description: e.target.value })} />
        <input placeholder='NFT Price in Eth' className='mt-2 border rounded p-4' onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
        <input type='file' name='Asset' className='my-4' onChange={onChange} />
        {
          fileUrl && (
            <img className='rounded mt-4 ' width='350' src={fileUrl} />
          )
        }
        <button onClick={createItem} className='font-bold mt-4 bg-[#f39c12] text-white rounded p-4 shadow-lg'>Mint NFT</button>
        <button onClick={listNFT} className='font-bold mt-4 bg-[#f39c12] text-white rounded p-4 shadow-lg'>List NFT</button>
      </div>
    </div>
  )
}