import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react';
import Web3Modal from 'web3modal';
import { Contract, providers, utils } from "ethers";
import { nftMarketplaceAddress, nftTokenAddress, nftTokenABI, nftMarketplaceABI } from '../../config';
import axios from "axios";
import { ethers } from 'ethers';


export default function myAssets() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [accountAddress, setAccountAddress] = useState(undefined)
  const [purchasedNFTs, setPurchasedNFTs] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      })
    }
    connectWallet()
    loadPurchasedNFTs()
  }, [walletConnected])

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (error) {
      console.log(error)
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

  const renderConnectButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>Connecté la wallet</button>
      )
    }
    return (
      <div className='truncate'>Connected to {accountAddress}</div>
    )
  }

  const loadPurchasedNFTs = async () => {
    try {
      const provider = await getProviderOrSigner();
      const marketplaceContract = new Contract(nftMarketplaceAddress, nftMarketplaceABI, provider);
      const myNFTs = await marketplaceContract.getPurchasedNFTs();
      console.log('purchased NFTs', myNFTs)
      const nftTokenContract = new Contract(nftTokenAddress, nftTokenABI, provider);
      const items = await Promise.all(myNFTs.map(async i => {
        let tokenURI = await nftTokenContract.tokenURI(i.tokenId);
        tokenURI = tokenURI.replace(/ipfs.infura.io/g, "ipfs.io");
        console.log(tokenURI);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId,
          seller: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        console.log(item)
        return item;
      }))
      console.log('items', items)
      setPurchasedNFTs(items)
      console.log('items after', items)
      setLoadingState('loaded')
    } catch (error) {
      console.log(error)
    }
  }

  return (

    <div className='flex justify-center'>
      <div className='p-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 pb-[112px]'>
          {
            purchasedNFTs.map((purchasedNFT, i) => (
              <div key={i} className='border shadow rounded-xl overflow-hidden'>
                <img className='h-[250px] w-[250px] object-cover' src={purchasedNFT.image} />
                <div className='p-4 bg-[#f6e58d]'>
                  <p className='text-2xl font-bold text-[#020028]'
                  >{purchasedNFT.price} Ether </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className='absolute right-20 w-[200px] overflow-hidden text-ellipsis'>
        {renderConnectButton()}
      </div>
    </div>

  )
}
