import React from 'react'
import deniedImg from '../assets/illustrations/404.png'
import bgShape from '../assets/illustrations/bgShape.png'
import { useNavigate } from 'react-router-dom'
const PageNotFound = () => {

    const navigate = useNavigate()

    return (
        <div className='flex flex-col justify-between h-screen pt-20'>
            <div className='flex flex-col items-center'>
                <h1 className='text-[5.8rem] leading-[5.8rem] mb-1 font-semibold text-[#444050]'>404</h1>
                <h3 className='text-[1.6rem] mb-1 text-[#444050] font-semibold'>Page Not Found️ ⚠️</h3>
                <p className='text-[#6D6B77]'>we couldn&apost find the page you are looking for</p>
                <button onClick={() => navigate("/")} className='bg-[#7367F0] hover:bg-[#5d53ce] transition-all duration-500 font-semibold mt-6 text-white p-[6px] px-[17px] shadow-[0px_5px_16px_-4px_#808080] rounded'>Back to home</button>
            </div>
            <div className='relative flex items-center justify-center'>
                <img className='h-[64vh]' src={deniedImg} alt="Denied vector" />
                <img className='absolute h-[40vh] bottom-0 w-full' src={bgShape} alt="Denied vector" />
            </div>
        </div>
    )
}

export default PageNotFound