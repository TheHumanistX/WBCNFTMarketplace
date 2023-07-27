import React from 'react'
import { ConnectWallet } from '@thirdweb-dev/react'
import { headerLogo } from '../assets';
import { Navigation } from './';

const Header = () => {
  return (
    <header>
      <div className='header__container'>
        <img src={headerLogo} alt='Small logo for the header' className='header__logo' />
        <Navigation />
        <ConnectWallet />
      </div>
    </header>
  )
}

export default Header
