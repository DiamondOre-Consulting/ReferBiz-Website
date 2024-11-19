import React, { useState, Fragment } from "react"

import { IoLogoFacebook } from "react-icons/io5"
import { FaGoogle } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { VscEye, VscEyeClosed } from "react-icons/vsc"

import { toast } from "sonner"
import { createAccount } from "../../Redux/Slices/authSlice"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Header from "../../Components/Header"

const SocialLoginButton = () => (
    <Fragment>
        <button className="flex items-center justify-center w-full px-6 py-3 mt-4 text-white bg-blue-600 rounded">
            <IoLogoFacebook className="mr-2 text-white " />
            <span className="text-center">Continue with Facebook</span>
        </button>
        <button className="flex items-center justify-center w-full px-6 py-3 mt-4 text-white bg-red-500 rounded">
            <FaGoogle className="mr-2 text-white " />
            <span className="text-center">Continue with Google</span>
        </button>
    </Fragment>
)

const SignUpForm = () => {
    const [loaderActive, setLoaderActive] = useState(false)
    const [eye, setEye] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [phone, setPhone] = useState('')


    const [registerData, setRegisterData] = useState({
        userEmail: "",
        fullName: "",
        userPassword: "",
        confirmPassword: "",
        referralCode: "",
        phoneNumber: ""
    })



    function handleUserInput(e) {
        const { name, value } = e.target
        setRegisterData({
            ...registerData,
            [name]: value
        })
    }

    const handleEyeClick = () => {
        setEye(!eye)
    }

    const register = async (e) => {
        e.preventDefault()
        setLoaderActive(true)
        setRegisterData({
            ...registerData,
            phoneNumber: phone
        })

        const { userEmail, userPassword, fullName, confirmPassword, referralCode, phoneNumber } = registerData
        if (!userEmail || !userPassword || !fullName || !confirmPassword) {
            setLoaderActive(false)
            return toast.error('Please fill all the fields!')
        }



        if (phoneNumber) {
            if (!phoneNumber.match(/^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-.\s]{7,14}$/)) {
                setLoaderActive(false)
                return toast.error('Phone number is invalid!')
            }
        }

        if (!userEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            setLoaderActive(false)
            return toast.error('Email is Invalid!')
        }

        if (userPassword.length < 8) {
            setLoaderActive(false)
            return toast.error('Password must contain Minimum eight characters!')
        }

        if (userPassword !== confirmPassword) {
            setLoaderActive(false)
            return toast.error('Password and confirm password must be same!')
        }

        const response = await dispatch(createAccount(registerData))


        if (response?.payload?.success) {
            setLoaderActive(false)
            navigate("/")
            setRegisterData({
                userEmail: "",
                userPassword: "",
                fullName: ""
            })
        } else {
            setLoaderActive(false)
        }
    }

    return (
        <form noValidate onSubmit={register}>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="fullName" className="mb-1 text-[0.85rem]  font-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="fullName"
                            placeholder="Your Full Name"
                            name="fullName"
                            onChange={handleUserInput}
                            value={registerData?.fullName}
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="userEmail" className="mb-1 text-[0.85rem]  font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="userEmail"
                            placeholder="Your email..."
                            name="userEmail"
                            onChange={handleUserInput}
                            value={registerData?.userEmail}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="phone" className="mb-1 text-[0.85rem]  font-semibold">
                            Phone Number
                        </label>
                        <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={setPhone}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                autoFocus: true,
                            }}
                            containerClass="mb-4 w-full"
                            inputClass="focus:outline-none focus:border-blue-700 border-gray-300 text-gray-800 rounded-md w-full py-2 px-3"
                            buttonClass="bg-gray-200 focus:outline-none focus:border focus:border-blue-600 rounded-l-md"
                            dropdownClass="custom-dropdown bg-white shadow-lg"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="relative flex flex-col mx-2 mb-6 overflow-hidden">
                        <label htmlFor="userPassword" className="mb-1 text-[0.85rem]  font-semibold">
                            Password
                        </label>
                        <input
                            type={`${eye ? 'password' : 'text'}`}
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="userPassword"
                            placeholder="Password"
                            name="userPassword"
                            onChange={handleUserInput}
                            value={registerData?.userPassword}
                        />
                        <div className='absolute bottom-0 right-0 p-[0.64rem] bg-transparent cursor-pointer text-[1.2rem] rounded-r-lg' onClick={handleEyeClick}>
                            {eye ? <VscEyeClosed /> :
                                <VscEye />}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="confirmPassword" className="mb-1 text-[0.85rem]  font-semibold">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handleUserInput}
                            value={registerData?.confirmPassword}
                        />
                    </div>
                </div>
                <div className="w-full ">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="referralCode" className="mb-1 text-[0.85rem]  font-semibold">
                            Refer code
                        </label>
                        <input
                            type="text"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="referralCode"
                            placeholder="Refer code"
                            name="referralCode"
                            onChange={handleUserInput}
                            value={registerData?.referralCode}
                        />
                    </div>
                </div>
            </div>

            <button className="w-full flex items-center justify-center gap-4 px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                Sign up{loaderActive && <div className='ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0'></div>}
            </button>

            <div className="relative">
                <hr className="my-6 border-gray-400 md:my-12" />
                <span className="absolute px-2 -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 ">
                    Or
                </span>
            </div>

            <SocialLoginButton />
        </form>
    )
}

const Register = () => {
    return (
        <>
            <Header />
            <section className="bg-gradient-to-r pt-10 flex relative overflow-hidden items-center justify-center from-[#281996] via-[#140A64] to-[#281996] font-poppins min-h-[100vh]">
                <div className='absolute bg-[#082ec4] blur-3xl  rounded-full w-[30vw] h-[50vh] top-[-6rem] left-[-1rem]'></div>
                <div className='absolute bg-[#082ec4d4] blur-3xl rounded-full w-[30vw] h-[50vh] bottom-[-6rem] right-0'></div>
                <div className="container relative px-4 mx-auto mt-10">
                    <div className="grid h-full grid-cols-6 gap-6">
                        <div className="col-span-6 md:col-span-2 lg:col-span-3">
                            <div
                                className="bg-cover bg-center bg-no-repeat min-h-[150px] rounded-md hidden md:block w-full md:w-[200%] lg:w-[150%] h-full"
                                style={{
                                    backgroundImage:
                                        "url(https://www.referbiz.in/assets/Employees-511dd0dc.jpg)",
                                }}
                            ></div>
                        </div>
                        <div className="col-span-6 py-6 md:col-span-4 lg:col-span-3">
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="p-4 py-6 bg-white rounded-lg shadow-xl md:p-8">
                                    <h2 className="mb-3 text-2xl font-bold text-indigo-900 ">
                                        Welcome to Refer Biz
                                    </h2>
                                    <div className="flex items-center mb-5">
                                        <p className="mb-0 mr-2 opacity-50">
                                            Already have an account?
                                        </p>
                                        <Link href="/login">Sign In</Link>
                                    </div>

                                    <SignUpForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Register