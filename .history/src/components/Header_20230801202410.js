import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { ConnectWallet } from '@thirdweb-dev/react'
import { Navigation } from './';

const Header = () => {

  return (
    <header>
      <div className='header__container'>
        <span className='header__logo'>mintfinity</span>
        <Navigation />
        <ErrorBoundary fallback={console.log('User rejected request...')}>
          <ConnectWallet className='header__wallet' />
        </ErrorBoundary>
      </div>
    </header>
  )
}

export default Header
