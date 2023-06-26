import React from 'react'
import { NavLink } from 'react-router-dom'
import { MarqueeScroller } from './'
import { marketplaceTitle } from '../assets'

const NAV__LINKS = [
    {
      display: "BUY NFT",
      url: "/buy_nft",
    },
    {
      display: "SELL NFT",
      url: "/sell_nft",
    },
    {
      display: "VIEW AUCTIONS",
      url: "/view_auctions",
    },
    {
      display: "CREATE AUCTION",
      url: "/create_auction",
    },
  ];


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
