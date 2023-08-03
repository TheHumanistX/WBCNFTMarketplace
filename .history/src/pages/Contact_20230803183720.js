import React from 'react'
import { useAddress } from '@thirdweb-dev/react'
import { useEthers } from '../context'

const Contact = () => {

  const { userWalletAddress } = useEthers()

  return (
    <section className='contact__container'>
      <form>
        <div>
          <label for='name'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            name='name'
          />
        </div>
        <div>
          <label for='email'>
            Email:
          </label>
          <input
            type='email'
            id='email'
            name='email'
          />
        </div>
        <div>
          <label for='walletAddress'>
            Wallet Address:
          </label>
          <input
            type='text'
            id='walletAddress'
            name='walletAddress'
            placeholder={userWalletAddress}
            disabled
          />
        </div>
        <div>
          <label for='comment'>
            Comment/Issue:
          </label>
          <textarea
            id='comment'
            name='comment'
            rows='4'
            cols='50'
          />
        </div>
        <div className='contact__form-buttons'>
          <input
            type='reset'
            value='Reset'
          />
          <input
            type='submit'
            value='Submit'
          />
        </div>

      </form>
    </section>
  )
}

export default Contact
