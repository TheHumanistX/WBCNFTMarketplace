import React from 'react'
import { crazyFaces, marketplaceTitle } from '../assets'


const Marketplace = () => {
  return (
    <section className='marketplace__container'>
      <div className='marketplace__title'>
        
          <img src={marketplaceTitle} className='marketplace__title-image' />
     
        
      </div>
      <div className='marketplace__nft-gifs'>
        <img src='https://i.seadn.io/gcs/files/f530eb01ed817788a7388c93087e1ae1.gif' />
        <img src='https://i.seadn.io/gcs/files/6a523a7e387822139fa5ea0c84c86ed4.gif' />
        <img src={crazyFaces} />
        <img src='https://i.seadn.io/gcs/files/09ee4f87424964297be6a15415756ca9.gif' />
      </div>
    </section>
  )
}

export default Marketplace
