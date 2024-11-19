import React, { useState, Fragment } from "react"
import { FaGoogle } from "react-icons/fa6"
import { IoLogoFacebook } from "react-icons/io5"
import signInGIF from '../../assets/illustrations/signIn.gif'
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { forgotPassword, loginAccount, resetPassword } from "../../Redux/Slices/authSlice"
import { VscEye, VscEyeClosed } from "react-icons/vsc"
import OTPInput from 'react-otp-input'
import Header from "../../Components/Header"


const SocialLoginButton = () => (
    <div className="flex items-center justify-center gap-4">
        <button className="flex items-center justify-center p-3 text-white bg-blue-600 rounded">
            <IoLogoFacebook className="text-white " />
        </button>
        <button className="flex items-center justify-center p-3 text-white bg-red-500 rounded">
            <FaGoogle className="text-white " />
        </button>
        <Link to={"/vendor/login"} className="bg-[#EA991A] p-2 px-3 text-white rounded">Login as Vendor</Link>
    </div>
)

const AuthForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otpValues, setOtpValues] = useState()
    const [resetActive, setResetActive] = useState(false)
    const [otpActive, setOTPActive] = useState(false)
    const [loaderActive, setLoaderActive] = useState(false)
    const [eye, setEye] = useState(true)
    const [loginData, setLoginData] = useState({
        userEmail: "",
        userPassword: "",
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

        const { userEmail, userPassword } = loginData
        if (!userEmail || !userPassword) {
            setLoaderActive(false)
            return toast.error('Please fill all the fields!')
        }

        if (!userEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            setLoaderActive(false)

            return toast.error('Email is Invalid!')
        }

        if (userPassword.length < 8) {
            setLoaderActive(false)

            return toast.error('Password must contain Minimum eight characters!')
        }

        const response = await dispatch(loginAccount(loginData))

        if (response?.payload?.success) {
            setLoaderActive(false)
            navigate("/")
            setLoginData({
                userEmail: "",
                userPassword: "",
            })
        } else {
            setLoaderActive(false)

        }
    }

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoaderActive(true)
        if (!loginData?.userEmail) {
            setLoaderActive(false)
            return toast.error('Please enter valid email!')
        }

        if (!loginData?.userEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
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

        if (!loginData.userPassword) {
            setLoaderActive(false)
            return toast.error("Enter new password!")
        }

        if (loginData.userPassword.length < 8) {
            setLoaderActive(false)
            return toast.error("New password must be 8 characters!!")
        }

        const resetData = {
            userEmail: loginData.userEmail,
            otp: otpValues,
            newPassword: loginData.userPassword
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
        <>

            {resetActive ?
                (otpActive ?
                    <div className="p-4 py-8 bg-white shadow-xl rounded-xl md:p-10">
                        <h2 className="mb-3 text-2xl font-bold text-indigo-900 ">
                            Reset Password
                        </h2>


                        <form noValidate onSubmit={verifyOtp}>
                            <div className="flex flex-col mx-2 mb-6 hover:cursor-not-allowed">
                                <label htmlFor="userEmail" className="mb-1 text-[0.85rem]  font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="px-4 leading-10 rounded-md pointer-events-none hover:cursor-not-allowed bg-blue-50 focus:outline-none focus:border focus:border-blue-600"
                                    id="userEmail"
                                    placeholder="Your email..."
                                    name="userEmail"
                                    // onChange={handleUserInput}
                                    value={loginData?.userEmail}
                                />
                            </div>
                            <div className="flex flex-col items-center py-4 mx-2 mb-4 space-y-4 rounded-md bg-blue-50">
                                <label className=" text-main text-[0.9rem] text-center">🔒 Verify Your Account by entering the OTP sent to your registered email</label>
                                <OTPInput
                                    value={otpValues}
                                    onChange={setOtpValues}
                                    numInputs={4}
                                    renderSeparator={<span className="w-[0.6rem] mx-[0.1rem] h-[0.05rem] bg-black"></span>}
                                    renderInput={(props) => <input {...props} className="border min-h-[2.4rem] text-[1.2rem] rounded bg-transparent border-main min-w-[2.4rem]" />}
                                />
                            </div>
                            <div className="relative flex flex-col mx-2 mb-6 overflow-hidden">
                                <label htmlFor="userPassword" className="mb-1 text-[0.85rem]  font-semibold">
                                    Enter new Password
                                </label>
                                <input
                                    type={`${eye ? 'password' : 'text'}`}
                                    className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                                    id="userPassword"
                                    placeholder="Enter new Password..."
                                    name="userPassword"
                                    onChange={handleUserInput}
                                    value={loginData?.userPassword}
                                />
                                <div className='absolute bottom-0 right-0 p-[0.64rem] bg-transparent cursor-pointer text-[1.2rem] rounded-r-lg' onClick={handleEyeClick}>
                                    {eye ? <VscEyeClosed /> :
                                        <VscEye />}
                                </div>
                            </div>
                            <p onClick={sendOtp} className="pr-1 mb-2"> <span className="font-semibold text-[0.95rem] underline cursor-pointer text-main tracking-wide">Resend OTP!</span></p>


                            <button type="submit" className="w-full flex items-center justify-center gap-4 px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                                Reset Password{loaderActive && <div className='ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0'></div>}
                            </button>


                        </form>
                        <div className="flex items-center justify-center mt-7">
                            <p className="mb-0 mr-2 opacity-50">Don't have an account?</p>
                            <Link to="/register" className="underline">Create Account</Link>
                        </div>
                    </div>

                    :
                    <div className="p-4 py-10 bg-white shadow-xl rounded-xl md:p-10">
                        <h2 className="mb-3 text-2xl font-bold text-indigo-900 ">
                            Reset Password
                        </h2>

                        <form noValidate onSubmit={sendOtp}>
                            <div className="flex flex-col mx-2 mb-6">
                                <p className="text-gray-700 text-[0.87rem] mb-9">Enter your registered email address, and we’ll send you a One-Time Password (OTP) to verify your identity. Once you receive the OTP, use it to proceed with resetting your password.</p>

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
                                    value={loginData?.userEmail}
                                />
                            </div>


                            <button className="w-full flex items-center justify-center gap-4 px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                                Send OTP{loaderActive && <div className='ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0'></div>}
                            </button>


                        </form>
                        <div className="flex items-center justify-center mt-8">
                            <p className="mb-0 mr-2 opacity-50">Don't have an account?</p>
                            <Link to="/register" className="underline">Create Account</Link>
                        </div>
                    </div>
                ) :
                <div className="p-4 py-8 bg-white shadow-xl rounded-xl md:p-10">
                    <h2 className="mb-3 text-2xl font-bold text-indigo-900 ">
                        Welcome to Refer Biz
                    </h2>
                    <div className="flex items-center mb-7">
                        <p className="mb-0 mr-2 opacity-50">Don't have an account?</p>
                        <Link to="/register" className="underline">Create Account</Link>
                    </div>
                    <form noValidate onSubmit={login}>
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
                                value={loginData?.userEmail}
                            />
                        </div>
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
                                value={loginData?.userPassword}
                            />
                            <div className='absolute bottom-0 right-0 p-[0.64rem] bg-transparent cursor-pointer text-[1.2rem] rounded-r-lg' onClick={handleEyeClick}>
                                {eye ? <VscEyeClosed /> :
                                    <VscEye />}
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-4 px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                            Log In{loaderActive && <div className='ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0'></div>}
                        </button>
                        <p onClick={() => setResetActive(true)} className="px-4 py-2 mx-auto rounded-lg cursor-pointer w-fit hover:text-blue-600">
                            Forget your password?
                        </p>
                        <div className="relative">
                            <hr className="my-5 border-t border-gray-300" />
                            <span className="absolute px-2 -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 ">
                                Or
                            </span>
                        </div>
                        <SocialLoginButton />
                    </form>
                </div>}
        </>
    )
}

const Login = () => {
    const [resetActive, setResetActive] = useState(false)



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
                                className="bg-cover bg-center bg-no-repeat min-h-[140px] rounded-xl hidden md:block w-full md:w-[200%] lg:w-[150%] h-full"
                                style={{
                                    backgroundImage:
                                        `url(https://www.referbiz.in/assets/Employees-511dd0dc.jpg)`,
                                }}
                            ></div>
                        </div>
                        <div className="z-10 col-span-6 py-6 md:col-span-4 lg:col-span-3">
                            <div className="w-full h-full max-w-[29rem] mx-auto">
                                <AuthForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login