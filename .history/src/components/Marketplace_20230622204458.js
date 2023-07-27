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
    </section>
  )
}

export default Marketplace
