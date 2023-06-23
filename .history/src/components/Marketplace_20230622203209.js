import React from 'react'
import { MarqueeScroller } from './'
import { marketplaceTitle } from '../assets'


const Marketplace = () => {
  return (
    <section className='marketplace__container'>
      <div className='marketplace__title'>
        
          <img src={marketplaceTitle} className='marketplace__title-image' />
     
        
      </div>
      <div className='marketplace__nft-gifs'>
      <MarqueeScroller />
      </div>
    </section>
  )
}

export default Marketplace
