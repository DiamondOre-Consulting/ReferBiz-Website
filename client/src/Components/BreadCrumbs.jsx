import React from 'react'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowRight } from 'react-icons/md';

const BreadCrumbs = ({ items, headText }) => {
    return (
        <div className="bg-gradient-to-r flex-col py-12 pt-28 flex relative overflow-hidden items-center  justify-center from-[#281996] via-[#140A64] to-[#281996] font-poppins ">
            <div className='absolute bg-[#082ec4] blur-3xl  rounded-full w-[30vw] h-[10vh] top-[-6rem] left-[-4rem]'></div>
            <div className='absolute bg-[#082ec4d4] blur-3xl rounded-full w-[30vw] h-[10vh] bottom-[-6rem] right-[-3rem]'></div>
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: `radial-gradient(#fff 1.5px, transparent 1.5px)`,
                    backgroundSize: '30px 30px',
                    opacity: 0.2,
                }}
            ></div>
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