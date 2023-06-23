import React from 'react'
import { homeLogo } from '../assets';

const Home = () => {
  return (
    <section className='home'>
      <img src={homeLogo} alt='Home Section Main Logo' />
      <div className='home-discover__button'>DISCOVER NOW</div>
    </section>
  )
}

export default Home
