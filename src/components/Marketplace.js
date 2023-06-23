import React from 'react'
import { MarqueeScroller } from './'
import { marketplaceTitle } from '../assets'


const Marketplace = () => {
  return (
    <section className='marketplace__container'>
      <div className='marketplace__title'>
        
          <img src={marketplaceTitle} className='marketplace__title-image' alt='Marketplace Title Logo' />
     
        
      </div>
      <div className='marketplace__marquee'>
      <MarqueeScroller />
      </div>
      <div className='marketplace__nav-buttons'>
        <div className='marketplace__nav-button'>BUY NFT</div>
        <div className='marketplace__nav-button'>SELL NFT</div>
        <div className='marketplace__nav-button'>VIEW AUCTIONS</div>
        <div className='marketplace__nav-button'>CREATE AUCTION</div>
      </div>
    </section>
  )
}

export default Marketplace
