import React from 'react'
import { NavLink } from 'react-router-dom'
import { MarqueeScroller } from '../components'
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
      <ul className="marketplace-buttons__list">
              {NAV__LINKS.map((item, index) => (
                <li className="marketplace-buttons__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(marketplaceButtonsClass) =>
                      marketplaceButtonsClass.isActive ? "active" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>      
    </section>
  )
}

export default Marketplace
