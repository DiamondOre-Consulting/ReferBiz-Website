import React from 'react'
import { FaRegEye, FaUser } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { GiBiceps, GiTakeMyMoney } from "react-icons/gi";
import BreadCrumbs from '../Components/BreadCrumbs';
import { MdCurrencyRupee } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const VendorList = () => {

    const vendorList = useSelector((state) => state.vendor.vendorList)

    console.log(vendorList)
    const navigate = useNavigate()

    const TeamvendorItem = ({ vendor }) => (

        <div onClick={() => navigate('/vendor-detail')} className="bg-[#040D43] border-t-[8px]  border-[#2c56ff] h-[16rem] w-[18.5rem] hover:bg-gradient-to-b hover:from-transparent group hover:via-[#1e43fa63] hover:to-[#1d46ea] shadow-xl rounded-b-xl rounded-sm p-6  mx-auto hover:shadow-xl transition-all duration-500 flex flex-col items-center justify-center">
            {/* Title */}
            <h4 className="mb-1 text-2xl font-medium">{vendor?.businessName}</h4>
            <p className="mb-4 text-sm">{vendor?.businessCategory}</p>
            <p className="opacity-50">{vendor?.bio}</p>

            <div className='flex items-center justify-center gap-6'>
                <div className='flex items-center justify-center gap-1 font-semibold text-[0.95rem]'>
                    <FaRegEye />
                    {vendor?.visitorCount}
                </div>
                <div className='flex items-center justify-center gap-1 font-semibold text-[0.95rem]'>
                    <FaUser />
                    {vendor?.totalReferrals.length}
                </div>
                <div className='flex items-center justify-center gap-1 font-semibold text-[0.95rem]'>
                    <GiBiceps />
                    {vendor?.totalReferrals.length}
                </div>

            </div>
            <div className='flex items-center justify-center font-semibold text-[1.3rem] mt-3'>
                <MdCurrencyRupee />
                {vendor?.totalTransactions}/-
            </div>
        </div>

    );

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Our Vendors' },
    ];

    return (

        <>
            <BreadCrumbs headText={"Our Vendors"} items={breadcrumbItems} />

            <div className="container relative z-20 px-4 mx-auto text-white">
                {/* <div className="flex justify-center mb-6 md:mb-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-3xl leading-none font-bold md:text-[45px] mb-4">
                            Our Vendors
                        </h2>
                        <p>
                            Assumenda non repellendus distinctio nihil dicta sapiente,
                            quibusdam maiores, illum at qui.
                        </p>
                    </div>
                </div> */}

                <div className='container grid grid-cols-1 gap-6 mx-auto mt-6 sm:grid-cols-2 w-fit lg:grid-cols-3'>
                    {vendorList?.map((vendor, i) => (
                        <TeamvendorItem key={i} vendor={vendor} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default VendorList
