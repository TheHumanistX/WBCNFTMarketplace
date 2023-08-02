import React, { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { ConnectWallet } from '@thirdweb-dev/react'
import { Navigation } from './';
import { AlertModal } from '../components';


const Header = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  const Fallback = ({ error, resetErrorBoundary }) => {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    setIsOpen(true);
    setModalText('User rejected request. Refer to console for more information.')
  }

  return (
    <header>
      <div className='header__container'>
        <span className='header__logo'>mintfinity</span>
        <Navigation />
        <ErrorBoundary
          FallbackComponent={Fallback}
          onReset={(details) => {
            // Reset the state of your app so the error doesn't happen again
          }}
        >
          <ConnectWallet className='header__wallet' />
        </ErrorBoundary>
      </div>
      <AlertModal open={isOpen} onClose={() => setIsOpen(false)}>
        {modalText}
      </AlertModal>
    </header>
  )
}

export default Header
