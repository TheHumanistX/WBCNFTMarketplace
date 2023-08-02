import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { ConnectWallet } from '@thirdweb-dev/react'
import { Navigation } from './';


const Header = ({ setIsOpen, setModalText }) => {



  const fallbackRender = ({ error, resetErrorBoundary }) => {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    setIsOpen(true);
    setModalText('User rejected request. Refer to console for more information.')
    return(console.log('User rejected request.'));
  }

  return (
    <header>
      <div className='header__container'>
        <span className='header__logo'>mintfinity</span>
        <Navigation />
        <ErrorBoundary
          fallbackRender={fallbackRender}
          onReset={(details) => {
            // Reset the state of your app so the error doesn't happen again
          }}
        >
          <ConnectWallet className='header__wallet' />
        </ErrorBoundary>
      </div>
    </header>
  )
}

export default Header
