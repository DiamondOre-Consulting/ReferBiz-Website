import React, { useEffect, useState } from 'react'
import HomeLayout from '../Layout/HomeLayout'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { deleteSubCategory, getCategory, updateCategory } from '../Redux/Slices/listSlice'
import { MdDelete } from 'react-icons/md'
import { FaEye, FaPen } from 'react-icons/fa'
import { toast } from 'sonner'
import { FaXmark } from 'react-icons/fa6'

const CategoryDetail = () => {
    const [loaderActive, setLoaderActive] = useState(false)
    const [subCategoryInput, setSubCategoryInput] = useState('')
    const [addCategoryActive, setAddCategoryActive] = useState(false)
    const [subCategoryUpdateActive, setSubCategoryUpdateActive] = useState(false)
    // const [viewingImage, setViewingImage] = useState(null)
    // const [statusUpdated, setStatusUpdated] = useState(false)

    const categoryData = useSelector((state) => state?.list?.categoryDetail)
    const categoryId = categoryData?._id
    const dispatch = useDispatch()
    const { id } = useParams()

    const loadData = () => {
        setLoaderActive(true)
        dispatch(getCategory(id)).finally(() => setLoaderActive(false))
    }

    useEffect(() => {
        loadData()
    }, [])

    console.log(categoryData)

    const mainDiv = 'flex flex-col gap-[0.5px]'



    const handleUpdate = async (e) => {
        e.preventDefault()

        setLoaderActive(true)

        const res = await dispatch(updateCategory([categoryId, { subCategory: subCategoryInput }]))

        if (res?.payload?.success) {
            setAddCategoryActive(false)
            setSubCategoryInput("")
            loadData()
            toast.success("Category updated successfully!")
        }
    }

    const handleDelete = async (data) => {

        setLoaderActive(true)

        const res = await dispatch(deleteSubCategory([categoryId, { subCategory: data }]))

        if (res?.payload?.success) {
            setSubCategoryInput("")
            loadData()
            toast.success("Sub-category deleted successfully!")
        }
    }

    return (
        <HomeLayout>
            <button onClick={() => setAddCategoryActive(true)} className='bg-[#EB9C1B] text-white z-20 p-2 rounded absolute right-6'>Add Sub Category +</button>

            {addCategoryActive && <div className='bg-[#212121b2] flex  justify-center h-full w-full fixed z-10'>
                <form action="" onSubmit={handleUpdate} className='flex mt-36 relative pb-8 h-fit gap-4 w-full max-w-[25rem] text-white flex-col bg-[#212631] rounded border-borderDark border p-4'>
                    <div onClick={() => setAddCategoryActive(false)} className='absolute bg-[#D04848] p-[0.4rem] cursor-pointer text-[1.1rem] rounded right-0 top-0'>
                        <FaXmark />
                    </div>
                    <h1 className='font-semibold text-[1.5rem] mb-4'>Add Sub Category</h1>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='mb-1 text-[0.9rem]'>Enter sub category</label>
                        <input type="text" className='rounded bg-[#1D222B] border border-borderDark p-2' onChange={(e) => setSubCategoryInput(e.target.value)} value={subCategoryInput} />
                    </div>
                    <button type='submit' className='bg-[#726CD0] rounded p-2'>Add</button>
                </form>
            </div>}
            {subCategoryUpdateActive && <div className='bg-[#212121b2] flex  justify-center h-full w-full fixed z-10'>
                <form action="" onSubmit={handleUpdate} className='flex mt-36 relative h-fit gap-4 w-full max-w-[25rem] text-white flex-col bg-[#212631] rounded border-borderDark border p-4'>
                    <div onClick={() => setSubCategoryUpdateActive(false)} className='absolute bg-[#D04848] p-[0.4rem] cursor-pointer text-[1.1rem] rounded right-0 top-0'>
                        <FaXmark />
                    </div>
                    <h1 className='font-semibold text-[1.5rem] mb-4'>Update Category</h1>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='mb-1 text-[0.9rem]'>Enter category</label>
                        <input type="text" className='rounded bg-[#1D222B] border border-borderDark p-2' onChange={(e) => setSubCategoryInput(e.target.value)} value={subCategoryInput} />
                    </div>
                    <button type='submit' className='bg-[#726CD0] rounded p-2'>Update</button>
                </form>
            </div>}
            {loaderActive ? (
                <SkeletonTheme baseColor="#2F3349" highlightColor="#3D4056">
                    <div className='flex items-center justify-center'>
                        <form className='p-6 bg-[#2F3349] text-white relative rounded-md shadow-[0px_0px_20px_#3D4056] overflow-hidden my-12 flex flex-col lg:flex-row gap-4 w-fit max-w-[100%] md:max-w-[80%] lg:max-w-[100%]'>
                            <div className='flex flex-col w-full gap-2'>
                                <div className='mb-4'>
                                    <h2 className='text-[1.8rem] font-semibold tracking-wide'>
                                        <Skeleton width={200} />
                                    </h2>
                                    <div className='flex items-center mt-2'>
                                        <Skeleton width={12} height={5} className='mr-1 rounded-full' />
                                        <Skeleton width={12} height={5} className='mr-1 rounded-full' />
                                        <Skeleton width={5} height={5} className='rounded-full' />
                                    </div>
                                </div>
                                <div className={mainDiv}>
                                    <Skeleton height={30} />
                                </div>
                                <div className={mainDiv}>
                                    <Skeleton height={30} />
                                </div>
                                <div className={mainDiv}>
                                    <Skeleton height={30} />
                                </div>
                                <div className='flex justify-between gap-2'>
                                    <div className={`${mainDiv} w-[48%]`}>
                                        <Skeleton height={30} />
                                    </div>
                                    <div className={`${mainDiv} w-[48%]`}>
                                        <Skeleton height={30} />
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col gap-2 lg:mt-[5rem]'>
                                <div className='flex justify-between gap-2'>
                                    <div className={`${mainDiv} w-[48%]`}>
                                        <Skeleton height={30} />
                                    </div>
                                    <div className={`${mainDiv} w-[48%]`}>
                                        <Skeleton height={30} />
                                    </div>
                                </div>
                                <div className='flex flex-col w-full mt-1'>
                                    <Skeleton height={50} />
                                    <div className='grid grid-cols-2 gap-2'>
                                        <Skeleton height={50} count={2} />
                                    </div>
                                </div>
                                <div className='flex items-center gap-4 min-w-[6.8rem] justify-center bg-white shadow-[0px_0px_12px_#808080_inset] mt-1 p-2 rounded text-black'>
                                    <Skeleton height={30} width={100} />
                                </div>
                            </div>
                        </form>
                    </div>
                </SkeletonTheme>
            ) : (
                <div className='mt-16 md:w-custom'>
                    <div className='text-white'>
                        <h1>{categoryData?.categoryName}</h1>

                    </div>
                    <div className='mt-2 overflow-x-scroll scrollbar scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-gray-800 scrollbar-thumb-gray-600 scrollbar-thin md:w-custom'>
                        <div className='flex border flex-col items-center justify-center border-[#323A49] rounded-t  min-w-[30rem]'>
                            <div className='flex items-center relative justify-between w-full gap-3 bg-[#323A49] rounded-t text-white px-3 py-4 lg:px-6 font-semibold'>
                                <p className='min-w-[3rem] text-center'>S.no</p>
                                <div className='min-w-[13rem] lg:min-w-[15rem] line-clamp-1'>
                                    <p>Sub-Category</p>
                                </div>
                                {/* <div className='min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1'>
                            <p>Email</p>
                        </div> */}
                                <p className='min-w-[3.3rem] sticky px-2 right-0 bg-[#323A49] text-center'>Action</p>
                            </div>
                            {
                                categoryData?.subCategory?.map((data, index) => (
                                    <div key={data?._id} className='relative text-[0.95rem] flex items-center border-t font-normal border-[#323A49] justify-between w-full gap-3 px-3 py-3 text-white bg-[#212631]'>
                                        <p className='min-w-[3rem] text-center'>{index + 1}.</p>
                                        <div className='min-w-[13rem] lg:min-w-[15rem] line-clamp-1'>
                                            <p>{data}</p>
                                        </div>
                                        {/* <div className='min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1'>
                                    <p>{data?.userEmail}</p>
                                </div> */}


                                        <div className='min-w-[3.3rem] sticky px-5 right-0 bg-[#212631] flex gap-2 items-center justify-center'>

                                            <div
                                                onClick={() => handleDelete(data)}
                                                className='bg-[#D04848] p-1 rounded cursor-pointer'>
                                                <MdDelete className='text-[1.5rem]' />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}
        </HomeLayout>
    )
}

export default CategoryDetail