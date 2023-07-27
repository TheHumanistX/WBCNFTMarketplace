import React from 'react'

const Contact = () => {
  return (
    <section className='contact__container'>
      <form>
        <label for='name'>Name: </label>
        <input type='text' id='name' name='name' />
        <label for='email'>Email: </label>
        <input type='email' id='email' name='email' />
        <label for='comment'>Comment: </label>
        <textarea id='comment' name='comment' /> </form>

      </form>
    </section>
  )
}

export default Contact
