"use client"
import React, {useState} from 'react'
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Formik } from 'formik';
import * as Yup from 'yup';

// interface
interface FormData {
  email: string;
}

// initialValues
const userInfo :FormData = {
    email:''
  }

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email address'
      ),
  });

const postURL = `https://linkedin.us21.list-manage.com/subscribe/post?u=${process.env.NEXT_PUBLIC_MAILCHIMP_U}&id=${process.env.NEXT_PUBLIC_MAILCHIMP_ID}`

export default function Home() {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState<boolean>(false);
  const [successModal ,setSuccessModal] = useState<boolean>(false);
  

  const handleSubmit = async (values: FormData, subscribe: any, status: any) =>{
    setLoading(true)
    try{
      await subscribe({
        EMAIL: values.email
      });
      setTimeout(() => {
        if (status === 'success') {
          setSuccessModal(true);
        }
        setLoading(false);
      }, 1000);
      
    }catch (error) {
      console.error(error);
      setStatus('error');
    }
  
  }
  return (
    <main className="h-screen py-14 w-full px-8">
      <div className='max-w-[1440px] mx-auto'>
        {/* Logo */}
          <div className='w-full lg:px-24 '><h3 className=''>Nosen - Studio</h3></div>
          {/* Headline */}
          <div className=" lg:pl-24 w-full mt-24">
            <h3 className='md:text-6xl text-2xl font-black mx-auto'>Reimagine the future of content creation</h3>
          </div>
          {/* Subscription Form */}
          <div className='grid md:grid-cols-2 grid-cols-1 lg:pl-24 mt-8 w-[800px] items-center '>
            <p className='mt-2'>Be the first to know when we launch{' '} <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>-&gt;</span></p>
            <MailchimpSubscribe
              url={postURL}
              render={({ subscribe, status, message }) =>(
                <>
                <Formik
                initialValues={userInfo}
                validationSchema={validationSchema}
                
                onSubmit={(values) =>{
                  if(values){
                    handleSubmit(values, subscribe, status)
                  }
                } }>
                    {({ values,touched, errors, handleChange,
                      handleBlur, handleSubmit }) =>{
                        const { email } = values;
                        return <div className='mt-4'>
                          <input type='email'  placeholder='Enter your email'  className='p-2 text-black' value={email}
                          onBlur={handleBlur('email')}
                          onChange={handleChange('email')}
                          required />
                         <button type='button' className='bg-red-600 ml-4 py-2 px-4 rounded-md' onClick={() => handleSubmit()}>{loading ? "loading..." : "Submit"}</button>
                        </div>
                      }}
                </Formik>
                </>
               
                  )} />
                  
           </div>
      </div>
      {successModal && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4" onClick={() =>setSuccessModal(false)}>
              <div className="bg-white rounded-lg p-6 text-center max-w-[464px] mx-auto">
                <h3 className="font-bold text-lg text-[#1C1C1C] ">Thank you for Subscribing</h3>
                <p className="py-4 text-[#1C1C1C] ">You will get notified as soon as we lauch 🚀</p>
              </div>
            </div>
      
      )}
      
    </main>
  )
}
