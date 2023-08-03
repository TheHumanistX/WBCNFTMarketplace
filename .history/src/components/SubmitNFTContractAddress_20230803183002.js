import React from 'react';

const SubmitNFTContractAddress = ({ setNFTContractAddress }) => {
    const handleSubmit = (e) => {
        e.preventDefault(); // prevent default form submission
        setNFTContractAddress(e.target.nftContractAddress.value);
    }

    return (
        <form onSubmit={handleSubmit} className='auctionNFT__contract-form'>
            <label>
                CONTRACT ADDRESS
            </label>
            <input
                type='text'
                id='nftContractAddress'
                placeholder='Contract Address'
            />
            <input
                type='submit'
                value='Submit' />
        </form>
    )
}

export default SubmitNFTContractAddress;
