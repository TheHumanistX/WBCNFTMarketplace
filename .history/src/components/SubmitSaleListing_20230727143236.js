import React, { useState} from 'react'

const SubmitSaleListing = ({ onListingSubmission, setListingCurrency, tokenId }) => {

    const [price, setPrice] = useState('');

    handleListingSubmission = (e) => {
        e.preventDefault();

        onListingSubmission({

        })
    }
    return (
        <>
            <form onSubmit={onListingSubmission} className='owned-nft__sale-form'>
                <label htmlFor='currency'>Currency: </label>
                <select
                    id='currency'
                    name='currency'
                    onChange={e => setListingCurrency(e.target.value)}
                >
                    <option value='ETH'>ETH</option>
                    <option value='WBC'>WBC</option>
                </select>
                <label htmlFor='price'>Price: </label>
                <input type='text' id='price' name='price' placeholder='Price' />
                <input type='hidden' id='tokenId' name='tokenId' value={tokenId} />
                <input type='submit' value='List For Sale' />
            </form>
        </>
    )
}

export default SubmitSaleListing
