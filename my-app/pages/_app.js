import '../styles/globals.css'
import '../styles/_app.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    <div className='header-app'>
      <nav className='nav-app'>
        <p className='titre-principal' >NFT Marketplace | Crypt'Ocres</p>
        <div className='burger-app'>
          <Link href='/'>
            <a className='titre-app'>Marketplace</a>
          </Link>
          <Link href='/create-item'>
            <a className='titre-app'>Mint NFTs</a>
          </Link>
          <Link href='/myAssets'>
            <a className='titre-app'>Mes NFTs</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace