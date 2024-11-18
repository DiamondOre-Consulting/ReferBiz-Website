import React, { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { forgotPassword, loginAccount, resetPassword } from "../../Redux/Slices/authSlice";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import OTPInput from 'react-otp-input'



const SignInForm = () => {



    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otpValues, setOtpValues] = useState();
    const [resetActive, setResetActive] = useState(false)
    const [otpActive, setOTPActive] = useState(false)
    const [loaderActive, setLoaderActive] = useState(false)
    const [eye, setEye] = useState(true)
    const [loginData, setLoginData] = useState({
        adminEmail: "",
        adminPassword: "",
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

        const { adminEmail, adminPassword } = loginData
        if (!adminEmail || !adminPassword) {
            setLoaderActive(false)
            return toast.error('Please fill all the fields!')
        }

        if (!adminEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            setLoaderActive(false)

            return toast.error('Email is Invalid!')
        }

        if (adminPassword.length < 8) {
            setLoaderActive(false)

            return toast.error('Password must contain Minimum eight characters!')
        }

        const response = await dispatch(loginAccount(loginData))

        if (response?.payload?.success) {
            setLoaderActive(false)
            navigate("/");
            setLoginData({
                adminEmail: "",
                adminPassword: "",
            })
        } else {
            setLoaderActive(false)

        }
    }

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoaderActive(true)
        if (!loginData?.adminEmail) {
            setLoaderActive(false)
            return toast.error('Please enter valid email!')
        }

        if (!loginData?.adminEmail.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
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

        if (!loginData.adminPassword) {
            setLoaderActive(false)
            return toast.error("Enter new password!")
        }

        if (loginData.adminPassword.length < 8) {
            setLoaderActive(false)
            return toast.error("New password must be 8 characters!!")
        }

        const resetData = {
            adminEmail: loginData.adminEmail,
            otp: otpValues,
            newPassword: loginData.adminPassword
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
                    <div className="p-4 relative py-8 bg-white shadow-xl rounded-xl md:p-10">
                        <h2 className="text-[1.25rem] text-center font-semibold top-0 w-full left-0 rounded-t-md p-3 bg-main absolute text-white">🔒 Reset Password 🔒</h2>
                        <form noValidate onSubmit={verifyOtp} className="mt-12">
                            <div className="flex flex-col mx-2 mb-6 hover:cursor-not-allowed">
                                <label htmlFor="adminEmail" className="mb-1 text-[0.85rem]  font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="px-4 leading-10 rounded-md pointer-events-none hover:cursor-not-allowed bg-blue-50 focus:outline-none focus:border focus:border-blue-600"
                                    id="adminEmail"
                                    placeholder="Your email..."
                                    name="adminEmail"
                                    // onChange={handleUserInput}
                                    value={loginData?.adminEmail}
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
                                <label htmlFor="adminPassword" className="mb-1 text-[0.85rem]  font-semibold">
                                    Enter new Password
                                </label>
                                <input
                                    type={`${eye ? 'password' : 'text'}`}
                                    className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                                    id="adminPassword"
                                    placeholder="Enter new Password..."
                                    name="adminPassword"
                                    onChange={handleUserInput}
                                    value={loginData?.adminPassword}
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

                    </div>

                    :
                    <div className="p-4 relative py-10 bg-white shadow-xl rounded-xl md:p-10">
                        <h2 className="text-[1.25rem] text-center font-semibold top-0 w-full left-0 rounded-t-md p-3 bg-main absolute text-white">🔒 Reset Password 🔒</h2>


                        <form noValidate onSubmit={sendOtp} className="mt-12">
                            <div className="flex flex-col mx-2 mb-6">
                                <p className="text-gray-700 text-[0.87rem] mb-9">Enter your registered email address, and we’ll send you a One-Time Password (OTP) to verify your identity. Once you receive the OTP, use it to proceed with resetting your password.</p>

                                <label htmlFor="adminEmail" className="mb-1 text-[0.85rem]  font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                                    id="adminEmail"
                                    placeholder="Your email..."
                                    name="adminEmail"
                                    onChange={handleUserInput}
                                    value={loginData?.adminEmail}
                                />
                            </div>


                            <button className="w-full flex items-center justify-center gap-4 px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                                Send OTP{loaderActive && <div className='ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0'></div>}
                            </button>


                        </form>

                    </div>
                ) :
                <div className="p-4 py-8 relative border bg-white shadow-xl rounded-xl md:p-10">
                    <h2 className="text-[1.25rem] text-center font-semibold top-0 w-full left-0 rounded-t-md p-3 bg-main absolute text-white">🔒 Welcome Admin 🔒</h2>

                    <form noValidate onSubmit={login} className="mt-20">
                        <div className="flex flex-col mx-2 mb-6">
                            <label htmlFor="adminEmail" className="mb-1 text-[0.85rem]  font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                className="px-4 py-1 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                                id="adminEmail"
                                placeholder="Your email..."
                                name="adminEmail"
                                onChange={handleUserInput}
                                value={loginData?.adminEmail}
                            />
                        </div>
                        <div className="relative flex flex-col mx-2 mb-6 overflow-hidden">
                            <label htmlFor="adminPassword" className="mb-1 text-[0.85rem]  font-semibold">
                                Password
                            </label>
                            <input
                                type={`${eye ? 'password' : 'text'}`}
                                className="px-4 py-1 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                                id="adminPassword"
                                placeholder="Password"
                                name="adminPassword"
                                onChange={handleUserInput}
                                value={loginData?.adminPassword}
                            />
                            <div className='absolute bottom-0 right-0 p-[0.64rem] bg-transparent cursor-pointer text-[1.2rem] rounded-r-lg' onClick={handleEyeClick}>
                                {eye ? <VscEyeClosed /> :
                                    <VscEye />}
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-4 px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                            Log In{loaderActive && <div className='ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0'></div>}
                        </button>
                        <p onClick={() => setResetActive(true)} className="px-4 mt-4 py-2 mx-auto rounded-lg cursor-pointer w-fit hover:text-blue-600">
                            Forget your password?
                        </p>

                    </form>
                </div>}
        </>

    );
};

const Login = () => {
    return (
        <section className="ezy__signin1 light py-14 md:py-24 bg-white  text-indigo-900  overflow-hidden">
            <div className="container mx-auto px-4 flex items-center justify-center">
                <div className="w-full max-w-lg bg-white">
                    <SignInForm />
                </div>
            </div>
        </section>
    );
};

export default Login
