import React from 'react'
import { MdOutlineSearch } from "react-icons/md";

const Hero = () => {
    return (
        <div className="bg-gradient-to-r flex relative overflow-hidden items-center justify-center from-[#a345d5] via-[#4c6ad5] to-[#a348d4] font-poppins min-h-[100vh]">
            <div className='absolute bg-[#a747db] blur-2xl animate-pulse duration-700 rounded-full w-[25vw] h-[50vh] top-0 left-0'></div>
            <div className='absolute bg-[#a247d3] blur-3xl animate-pulse rounded-full w-[25vw] h-[50vh] bottom-0 right-0'></div>

            <main
                className={`relative h-full backdrop-blur-md w-full overflow-hidden z-[100] `}
            >
                <div
                    className={` z-[100]  pb-0 flex w-full h-full  items-center object-cover flex-col justify-between  text-white py-[1rem] gap-2`}
                >
                    <div className="flex flex-col max-w-[40rem] container border-white z-[100] items-center justify-center gap-3 w-[100%]">
                        <h1
                            data-aos="fade-left"
                            className="tracking-[1px] font-roboto p-[2px] px-4 rounded-full text-[3rem] text-center  text-red font-[800] capitalize"
                        >
                            Referral revolution  where  we play, earn,  and learn
                        </h1>
                        <p data-aos="fade-right" data-aos-duration="900" className='text-[1.1rem] mt-4
     text-center'>                                Unleash the power of ReferBiz! It's not just a platform, it's a lifestyle that lets you play, earn, and learn, all in one place.
                        </p>
                        <div className="flex bg-white rounded-full  w-fit items-center text-[0.9rem] gap-2 justify-center p-1  mt-8">
                            <input type="text" placeholder='Enter location...' className='px-4 w-[16rem] sm:w-[20rem] text-black outline-none' />
                            <button className="p-[0.65rem] px-5 text-[1.1rem] flex items-center justify-center gap-2 bg-black rounded-full tracking-wide bg-red relative z-[10000]">
                                <MdOutlineSearch className='text-[1.3rem]' /> Search
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* <BlogPage /> */}
        </div>
    )
}

export default Hero
