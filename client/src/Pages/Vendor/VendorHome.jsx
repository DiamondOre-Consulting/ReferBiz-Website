import React, { useState } from 'react'
import HomeLayout from '../../Layout/HomeLayout'
import { HiOutlineUsers } from 'react-icons/hi2'
import { GrMoney } from "react-icons/gr"
import { GiTakeMyMoney } from 'react-icons/gi'
// import Statistics from '../Components/Cards/Statistics'
// import MonthlyPaymentsChart from '../Components/Cards/MonthlyPaymentsChart'
// import BookingsRevenueChart from '../Components/Cards/BookingsRevenueChart'


const VendorHome = () => {

    return (
        <HomeLayout>
            <div className='flex flex-wrap justify-center gap-4 text-white'>
                <div className='bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg'>
                    <h3 className='text-[1.6rem] font-semibold'>40,000</h3>
                    <p className='text-[1.2rem]'>Users</p>
                    <HiOutlineUsers className='absolute bottom-[-3rem] right-[-1rem] text-[#ffffff66] text-[11rem]' />
                </div>
                <div className='bg-[#EA991A] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg'>
                    <h3 className='text-[1.6rem] font-semibold'>₹4,00,000</h3>
                    <p className='text-[1.2rem]'>Income</p>
                    <GiTakeMyMoney className='absolute bottom-[-3rem] right-[-2rem] text-[#ffffff66] text-[11rem]' />
                </div>
                <div className='bg-[#3B92E6] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg'>
                    <h3 className='text-[1.6rem] font-semibold'>40,000</h3>
                    <p className='text-[1.2rem]'>Users</p>
                    <HiOutlineUsers className='absolute bottom-[-3rem] right-[-1rem] text-[#ffffff66] text-[11rem]' />
                </div>
                <div className='bg-[#D24D4D] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg'>
                    <h3 className='text-[1.6rem] font-semibold'>40,000</h3>
                    <p className='text-[1.2rem]'>Users</p>
                    <HiOutlineUsers className='absolute bottom-[-3rem] right-[-1rem] text-[#ffffff66] text-[11rem]' />
                </div>
            </div>
        </HomeLayout>
    )
}

export default VendorHome