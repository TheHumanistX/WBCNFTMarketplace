import React from 'react'
import Marquee from 'react-fast-marquee';
import { crazyFaces } from '../assets'

const MarqueeScroller = () => {
  return (
    <div>
      <Marquee direction="left" speed={100} delay={0}>
        <img src='https://i.seadn.io/gcs/files/f530eb01ed817788a7388c93087e1ae1.gif' />
        <img src='https://i.seadn.io/gcs/files/6a523a7e387822139fa5ea0c84c86ed4.gif' />
        <img src={crazyFaces} />
        <img src='https://i.seadn.io/gcs/files/09ee4f87424964297be6a15415756ca9.gif' />
        
        <img src='https://i.seadn.io/gcs/files/f1273e4adc887cec40bb92952ca047d2.gif' />
        <img src='https://i.seadn.io/gcs/files/9527878b82204ea95089de2fe8550997.gif' />
      </Marquee>
    </div>
  )
}

export default MarqueeScroller
