import React from 'react'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowRight } from 'react-icons/md';

const BreadCrumbs = ({ items, headText }) => {
    return (
        <div className="bg-gradient-to-r flex flex-col py-14 pt-28 relative overflow-hidden items-center justify-center from-[#a345d5] via-[#4c6ad5] to-[#a348d4] font-poppins ">
            <div className='absolute bg-[#a747db] blur-2xl animate-pulse duration-700 rounded-full w-[25vw] h-[50vh] top-0 left-0'></div>
            <div className='absolute bg-[#a247d3] blur-3xl animate-pulse rounded-full w-[25vw] h-[50vh] bottom-0 right-0'></div>

            <h1 className='text-white text-center relative z-[100] sora-600 text-[2.5rem] px-2 mb-2'>{headText}</h1>
            <nav className="flex items-center relative z-[40] flex-wrap  justify-center p-1 space-x-1 px-2 text-gray-300 text-[0.95rem] ">
                {items?.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="text-white"><MdKeyboardArrowRight className='text-[1.5rem] mt-[0.2rem]' /></span>}
                        {item.href ? (
                            <Link
                                to={item.href}
                                className="hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-semibold text-[1rem] text-center text-gray-200">{item.label}</span>
                        )}
                    </React.Fragment>
                ))}
            </nav>

            <div
                className='absolute size-[25rem] lg:size-[40rem] top-[10%] right-[-20%] lg:top-[8%] lg:right-[-10%] rounded-full z-10'
                style={{
                    background: 'radial-gradient(circle, rgba(36, 67, 230, 0.5) 2%, rgba(36, 67, 230, 0) 65%)',
                }}
            ></div>
            <div
                className='absolute size-[25rem] lg:size-[40rem] top-[10%] left-[-20%] lg:top-[8%] lg:left-[-10%] rounded-full z-10'
                style={{
                    background: 'radial-gradient(circle, rgba(36, 67, 230, 0.5) 2%, rgba(36, 67, 230, 0) 65%)',
                }}
            ></div>
        </div>
    )
}

export default BreadCrumbs