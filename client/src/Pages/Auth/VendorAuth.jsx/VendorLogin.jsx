import React, { useState } from "react"
import vendorLogin from '../../../assets/illustrations/vendorLogin.png'
import { VscEye, VscEyeClosed } from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { vendorLoginAccount } from "../../../Redux/Slices/authSlice"

const SignInForm = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otpValues, setOtpValues] = useState()
    const [resetActive, setResetActive] = useState(false)
    const [otpActive, setOTPActive] = useState(false)
    const [loaderActive, setLoaderActive] = useState(false)
    const [eye, setEye] = useState(true)
    const [loginData, setLoginData] = useState({
        vendorEmail: "",
        vendorPassword: "",
    })



    function handleUserInput(e) {
        const { name, value } = e.target
        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const handleEyeClick = () => {
        setEye(!eye)
    }

    const login = async (e) => {
        e.preventDefault()

        setLoaderActive(true)

        const { vendorEmail, vendorPassword } = loginData
        if (!vendorEmail || !vendorPassword) {
            setLoaderActive(false)
            return toast.error('Please fill all the fields!')
        }

        if (!vendorEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            setLoaderActive(false)

            return toast.error('Email is Invalid!')
        }

        if (vendorPassword.length < 8) {
            setLoaderActive(false)

            return toast.error('Password must contain Minimum eight characters!')
        }

        const response = await dispatch(vendorLoginAccount(loginData))

        if (response?.payload?.success) {
            setLoaderActive(false)
            navigate("/")
            setLoginData({
                vendorEmail: "",
                vendorPassword: "",
            })
        } else {
            setLoaderActive(false)

        }
    }

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoaderActive(true)
        if (!loginData?.vendorEmail) {
            setLoaderActive(false)
            return toast.error('Please enter valid email!')
        }

        if (!loginData?.vendorEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            setLoaderActive(false)
            return toast.error('Email is Invalid!')
        }

        const response = await dispatch(forgotPassword(loginData))

        if (response?.payload?.success) {
            setLoaderActive(false)
            setOTPActive(true)
        } else {
            setLoaderActive(false)
        }

        setLoaderActive(false)
    }

    const verifyOtp = async (e) => {
        e.preventDefault()
        setLoaderActive(true)
        if (otpValues.length !== 4) {
            setLoaderActive(false)
            return toast.error("Enter 4 digit otp!")
        }

        if (!loginData.vendorPassword) {
            setLoaderActive(false)
            return toast.error("Enter new password!")
        }

        if (loginData.vendorPassword.length < 8) {
            setLoaderActive(false)
            return toast.error("New password must be 8 characters!!")
        }

        const resetData = {
            vendorEmail: loginData.vendorEmail,
            otp: otpValues,
            newPassword: loginData.vendorPassword
        }

        const response = await dispatch(resetPassword(resetData))

        if (response?.payload?.success) {
            setOTPActive(false)
            setResetActive(false)
            setLoaderActive(false)
        } else {
            setLoaderActive(false)
        }

        setLoaderActive(false)

    }

    return (
        <form noValidate onSubmit={login}>
            <div className="flex flex-col mx-2 mb-6">
                <label htmlFor="vendorEmail" className="mb-1 text-[0.85rem]  font-semibold">
                    Email
                </label>
                <input
                    type="email"
                    className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                    id="vendorEmail"
                    placeholder="Your email..."
                    name="vendorEmail"
                    onChange={handleUserInput}
                    value={loginData?.vendorEmail}
                />
            </div>
            <div className="relative flex flex-col mx-2 mb-6 overflow-hidden">
                <label htmlFor="vendorPassword" className="mb-1 text-[0.85rem]  font-semibold">
                    Password
                </label>
                <input
                    type={`${eye ? 'password' : 'text'}`}
                    className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                    id="vendorPassword"
                    placeholder="Password"
                    name="vendorPassword"
                    onChange={handleUserInput}
                    value={loginData?.vendorPassword}
                />
                <div className='absolute bottom-0 right-0 p-[0.64rem] bg-transparent cursor-pointer text-[1.2rem] rounded-r-lg' onClick={handleEyeClick}>
                    {eye ? <VscEyeClosed /> :
                        <VscEye />}
                </div>
            </div>

            <button className="w-full px-6 py-[0.65rem]  text-white rounded bg-main">
                Log In
            </button>
            <button className="w-full px-4 py-3 mt-2 rounded-lg hover:text-blue-600">
                Forget your password?
            </button>

        </form>
    )
}

const VendorLogin = () => {
    return (
        <section className="pt-[4.5rem] md:pt-0 h-[100vh] overflow-hidden flex items-center justify-center bg-gray-200 light text-zinc-900">
            <div className="container h-full px-1 mx-auto">
                <div className="grid h-full grid-cols-12">
                    <div className="order-2 col-span-12 lg:col-span-6 lg:col-start-7">
                        <div
                            className="hidden md:block h-full w-full lg:w-[70vw] bg-center float-left"

                        >
                            <img src={vendorLogin} alt="Vendor auth bg" className="max-w-[50vw]" />

                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:col-start-2 ">
                        <div className="flex flex-col items-center justify-center h-full ">

                            <div className="w-full max-w-md p-[3vw] py-6 pt-20 sm:pt-20 md:pt-20 relative mx-auto border rounded-md shadow-lg sm:p-6 bg-gray-50 md:py-10">
                                <h2 className="text-[1.25rem] text-center font-semibold top-0 w-full left-0 rounded-t-md p-3 bg-main absolute text-white">🔒 Vendor Login 🔒</h2>

                                <h1 className="mb-3 text-[1.6rem] font-bold text-main ">
                                    Welcome to Refer Biz
                                </h1>
                                <p className="my-8 mt-2">Hello partner welcome to your dashboard. Sign-up now to get your shop ready.</p>
                                <SignInForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default VendorLogin