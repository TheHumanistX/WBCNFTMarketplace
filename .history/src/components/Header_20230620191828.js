import React from 'react'
import { headerLogo } from '../assets';
import { Navigation } from './';

const Header = () => {
  return (
    <header>
      <div className='header__container'>
        <img src={headerLogo} alt='Small logo for the header' />
        <Navigation />
      </div>
    </header>
  )
}

export default Header
