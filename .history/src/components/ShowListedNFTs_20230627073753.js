import React, { useState } from 'react'

const ShowListedNFTs = ({ liveListings }) => {
    const [nftData, setNftData] = useState(null);

  return (
    <div>
        {liveListings && liveListings.map((listing, index) => {
            return (
                <div key={index}>
                <span>Listing ID: {listing}</span>
                <img src=
                </div>
            )
        }
    </div>
  )
}

export default ShowListedNFTs
