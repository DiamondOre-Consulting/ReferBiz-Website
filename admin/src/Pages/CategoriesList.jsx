import React, { useEffect, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from 'react-redux'
import { FaEye, FaPen } from 'react-icons/fa'
import { GrFormNext, GrFormPrevious } from "react-icons/gr"
import { useNavigate } from 'react-router-dom'
import { addCategory, deleteCategory, getCategoriesList, getUsersList, updateCategory } from '../Redux/Slices/listSlice'
import HomeLayout from '../Layout/HomeLayout'
import { toast } from 'sonner'
import { MdDelete } from 'react-icons/md'
import { FaXmark } from 'react-icons/fa6'

const CategoriesList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const list = useSelector((state) => state?.list?.categoriesList)

    const [addCategoryActive, setAddCategoryActive] = useState(false)
    const [addCategoryUpdateActive, setAddCategoryUpdateActive] = useState(false)
    const [statusUpdated, setStatusUpdated] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [categoryInput, setCategoryInput] = useState('')
    const [categoryId, setCategoryId] = useState()


    const loadData = async (page = 1) => {
        setLoading(true)
        try {
            const params = {
                page,
                limit: itemsPerPage,
                searchQuery,
                statusFilter
            }
            const response = await dispatch(getCategoriesList(params)).unwrap()
            setTotalPages(response.totalPages)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData(currentPage)
    }, [currentPage, itemsPerPage, searchQuery, statusFilter])

    useEffect(() => {
        if (statusUpdated) {
            loadData(currentPage)
            setStatusUpdated(false)
        }
    }, [statusUpdated])

    const handleSearch = useCallback(
        debounce((query, status) => {
            setSearchQuery(query)
            setStatusFilter(status)
            setCurrentPage(1)
        }, 10),
        []
    )

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const handleAddCategory = async (e) => {
        e.preventDefault()

        if (!categoryInput) {
            toast.error("Category is required!")
        }


        const res = await dispatch(addCategory({ categoryName: categoryInput }))

        if (res?.payload?.success) {
            setCategoryInput("")
            setAddCategoryActive(false)
        }
    }

    const handleDelete = async (id) => {
        const res = await dispatch(deleteCategory(id))

        if (res?.payload?.success) {
            toast.success("Category deleted successfully")
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        const res = await dispatch(updateCategory([categoryId, { categoryName: categoryInput }]))

        if (res?.payload?.success) {
            setAddCategoryUpdateActive(false)
            setCategoryInput("")
            toast.success("Category updated successfully!")
        }
    }

    return (
        <HomeLayout>
            {addCategoryActive && <div className='bg-[#212121b2] flex md:w-custom justify-center h-full w-full fixed z-10'>
                <form action="" onSubmit={handleAddCategory} className='flex mt-36 relative pb-8 h-fit gap-4 w-full max-w-[25rem] text-white flex-col bg-[#212631] rounded border-borderDark border p-4'>
                    <div onClick={() => setAddCategoryActive(false)} className='absolute bg-[#D04848] p-[0.4rem] cursor-pointer text-[1.1rem] rounded right-0 top-0'>
                        <FaXmark />
                    </div>
                    <h1 className='font-semibold text-[1.5rem] mb-4'>Add Category</h1>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='mb-1 text-[0.9rem]'>Enter category</label>
                        <input type="text" className='rounded bg-[#1D222B] border border-borderDark p-2' onChange={(e) => setCategoryInput(e.target.value)} value={categoryInput} />
                    </div>
                    <button type='submit' className='bg-[#726CD0] rounded p-2'>Add</button>
                </form>
            </div>}
            {addCategoryUpdateActive && <div className='bg-[#212121b2] flex md:w-custom justify-center h-full w-full fixed z-10'>
                <form action="" onSubmit={handleUpdate} className='flex mt-36 relative h-fit gap-4 w-full max-w-[25rem] text-white flex-col bg-[#212631] rounded border-borderDark border p-4'>
                    <div onClick={() => setAddCategoryUpdateActive(false)} className='absolute bg-[#D04848] p-[0.4rem] cursor-pointer text-[1.1rem] rounded right-0 top-0'>
                        <FaXmark />
                    </div>
                    <h1 className='font-semibold text-[1.5rem] mb-4'>Update Category</h1>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='mb-1 text-[0.9rem]'>Enter category</label>
                        <input type="text" className='rounded bg-[#1D222B] border border-borderDark p-2' onChange={(e) => setCategoryInput(e.target.value)} value={categoryInput} />
                    </div>
                    <button type='submit' className='bg-[#726CD0] rounded p-2'>Update</button>
                </form>
            </div>}
            <button onClick={() => setAddCategoryActive(true)} className='bg-[#EB9C1B] text-white z-20 p-2 rounded absolute right-6'>Add Category +</button>
            <div className='flex flex-col md:w-custom lg:flex-row border border-[#323A49] items-center justify-between gap-4 p-3 mt-12 bg-[#212631] rounded '>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value, statusFilter)}
                    className="bg-[#323A49] outline-none text-white rounded p-2 lg:w-[20rem] w-full"
                />
                <div className='flex items-center justify-between w-full lg:w-fit lg:gap-2 xl:gap-10'>
                    <div>
                        <label htmlFor="" className='text-white text-[1.1rem] mr-2'>Show:</label>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="bg-[#323A49]  outline-none text-white rounded p-2 sm:w-[6rem] w-[4rem]"
                        >
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='mt-2 overflow-x-scroll scrollbar scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-gray-800 scrollbar-thumb-gray-600 scrollbar-thin md:w-custom'>
                <div className='flex border  flex-col items-center justify-center border-[#323A49] rounded-t  min-w-[55.5rem]'>
                    <div className='flex items-center relative justify-between w-full gap-3 bg-[#323A49] rounded-t text-white px-3 py-4 lg:px-6 font-semibold'>
                        <p className='min-w-[3rem] text-center'>S.no</p>
                        <div className='min-w-[13rem] lg:min-w-[15rem] line-clamp-1'>
                            <p>Category Name</p>
                        </div>
                        {/* <div className='min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1'>
                            <p>Email</p>
                        </div> */}
                        <p className='min-w-[3.3rem] sticky px-2 right-0 bg-[#323A49] text-center'>Action</p>
                    </div>
                    {loading ? (
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                            <div key={index} className='flex items-center justify-between w-full gap-3 px-3 py-3 text-black bg-[#212631]'>
                                <p className='min-w-[3rem] text-center'><Skeleton /></p>
                                <div className='min-w-[13rem] lg:min-w-[15rem] line-clamp-1'>
                                    <p><Skeleton /></p>
                                </div>
                                {/* <div className='min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1'>
                                    <p><Skeleton /></p>
                                </div> */}


                                <div className='min-w-[3.3rem] flex items-center justify-center'>
                                    <Skeleton width={24} height={24} />
                                </div>
                            </div>
                        ))
                    ) : (
                        list?.map((data, index) => (
                            <div key={data?._id} className='relative text-[0.95rem] flex items-center border-t font-normal border-[#323A49] justify-between w-full gap-3 px-3 py-3 text-white bg-[#212631]'>
                                <p className='min-w-[3rem] text-center'>{(currentPage - 1) * itemsPerPage + index + 1}.</p>
                                <div className='min-w-[13rem] lg:min-w-[15rem] line-clamp-1'>
                                    <p>{data?.categoryName}</p>
                                </div>
                                {/* <div className='min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1'>
                                    <p>{data?.userEmail}</p>
                                </div> */}


                                <div className='min-w-[3.3rem] sticky px-5 right-0 bg-[#212631] flex gap-2 items-center justify-center'>
                                    <div onClick={() => {
                                        setAddCategoryUpdateActive(true)
                                        setCategoryInput(data?.categoryName)
                                        setCategoryId(data?._id)
                                    }} className='bg-[#ff9114] p-2 rounded cursor-pointer'>
                                        <FaPen className='text-[1rem]' />
                                    </div>
                                    <div onClick={() => handleDelete(data?._id)} className='bg-[#D04848] p-1 rounded cursor-pointer'>
                                        <MdDelete className='text-[1.5rem]' />
                                    </div>
                                    <FaEye onClick={() => navigate(`/category/${data?._id}`, { state: data?._id })} className='text-[1.45rem] cursor-pointer' />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between mt-2 border border-[#323A49] bg-[#212631] text-white rounded overflow-hidden ">
                <button
                    className='flex items-center justify-center bg-[#7367F0] p-3'
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    <GrFormPrevious className='text-[1.4rem] mt-1' /> Previous
                </button>
                <span className='font-semibold '>Page {currentPage} of {totalPages}</span>
                <button
                    className='flex items-center justify-center bg-[#7367F0] p-3'
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}>
                    Next <GrFormNext className='text-[1.4rem] mt-1' />
                </button>
            </div>
        </HomeLayout >
    )
}

export default CategoriesList