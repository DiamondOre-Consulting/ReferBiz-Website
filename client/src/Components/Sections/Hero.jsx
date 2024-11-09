import React from 'react'

const Hero = () => {
    return (
        <div className="bg-gradient-to-r from-[#AD49E1] via-[#4B70F5] to-[#AD49E1] font-poppins min-h-[100vh]">
            <main
                className={`relative h-full backdrop-blur-md w-full overflow-hidden z-[100] `}
            >
                <div
                    className={` z-[100]  pb-0 flex w-full h-full  items-center object-cover flex-col justify-between  text-white py-[1rem] gap-2`}
                >
                    <div className="flex flex-col  border-white z-[100000] items-center justify-center gap-3 w-[100%] overflow-hidden">
                        <h1
                            data-aos="fade-left"
                            className="tracking-[3px]  p-[2px] px-4 rounded-full text-[1.15rem] text-center mt-[7rem] text-red font-[800]"
                        >
                            Referral revolution where we play, earn, and learn
                        </h1>
                        {/* <h1 data-aos="fade-right" data-aos-duration="900" className='font-[500] tracking-wide md:leading-[4.5rem]  text-[2.7rem] sm:text-[3rem] md:text-[3.5rem]
     text-center'>A Gateway to New Era Business Consultancy</h1> */}
                        <div className="flex items-center text-[0.9rem] gap-2 justify-center p-1 w-[100vw] mt-4">
                            <button className="p-2 px-10 text-[1.1rem] tracking-wide rounded bg-red relative z-[10000]">
                                Initiate with us
                            </button>
                            {/* <button data-aos="fade-left" onClick={() => setCallFormActive(true)} className='p-2 px-4 tracking-wide rounded bg-blue'>Request a Callback</button> */}
                        </div>
                    </div>
                    <div className="mt-[5rem] w-full flex flex-col items-center justify-center pt-2">
                        <p className="text-[1.3rem] font-[500] tracking-wide bg-light p-1 px-3 rounded-full text-blue z-[100]">
                            Our Happy Clients😊
                        </p>
                    </div>
                </div>
            </main>

            {/* <BlogPage /> */}
        </div>
    )
}

export default Hero
