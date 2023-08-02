import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { ConnectWallet } from '@thirdweb-dev/react'
import { Navigation } from './';

const Header = () => {

  const Fallback = ({ error, resetErrorBoundary }) => {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
      </div>
    );
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
    </header>
  )
}

export default Header
