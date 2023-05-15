
import React, {useState} from 'react'

const SimpleForm = ({status, message, onValidated}) => {
  const [email, setEmail] = useState('');
  return (
    <>
    <form className='mt-4'>
      <input type='email'  placeholder='Enter your email'  className='p-2 text-black' value={email} required />
      <input type='submit' className='bg-red-600 ml-4 py-2 px-4 rounded-md'/>
    </form>
    </>
  )
}

export default SimpleForm