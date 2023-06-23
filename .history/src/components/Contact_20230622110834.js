import React from 'react'

const Contact = () => {
  return (
    <section className='contact__container'>
      <form>
        <div>
        <label for='name'>Name: </label>
        <input type='text' id='name' name='name' />
        </div>
        <div>
        <label for='email'>Email: </label>
        <input type='email' id='email' name='email' />
        </div>
        <div>
        <label for='comment'>Comment: </label>
        <textarea id='comment' name='comment' rows='4' cols='50' /> 
        </div>

      </form>
    </section>
  )
}

export default Contact
