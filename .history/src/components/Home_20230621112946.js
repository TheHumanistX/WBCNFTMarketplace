import React from 'react'
import { homeLogo } from '../assets';

const Home = () => {
  return (
    <section className='home__container'>
      <img src={homeLogo} alt='Home Section Main Logo' className='home__logo' />
      <div className='home-discover__button'>DISCOVER NOW</div>
    </section>
  )
}

export default Home
