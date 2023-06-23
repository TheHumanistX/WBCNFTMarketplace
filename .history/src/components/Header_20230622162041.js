import React from 'react'
import { ConnectWallet } from '@thirdweb-dev/react'
import { headerLogo } from '../assets';
import { Navigation } from './';

const Header = () => {
  return (
    <header>
      <div className='header__container'>
        <span className='header__logo'>mintfinity</span>
        <Navigation />
        <ConnectWallet />
      </div>
    </header>
  )
}

export default Header
