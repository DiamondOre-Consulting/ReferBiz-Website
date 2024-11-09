import React, { useState, Fragment } from "react";
import { FaGoogle } from "react-icons/fa6";
import { IoLogoFacebook } from "react-icons/io5";
import signInGIF from '../../assets/illustrations/signIn.gif'
import { Link } from "react-router-dom";

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
);

const SignInForm = () => {

    const handleSubmit = (e) => {
        e.preventDefault();


    };

    return (
        <form noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
                <input
                    type="text"
                    className="w-full bg-blue-50  leading-10 px-4 p-[0.2rem] rounded-md outline-none border border-transparent focus:border-blue-600"
                    id="email"
                    placeholder="Enter Email Address"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    className="w-full p-[0.2rem] px-4 leading-10 border border-transparent rounded-md outline-none bg-blue-50 focus:border-blue-600"
                    id="password"
                    placeholder="Enter Password"
                />
            </div>

            <button className="w-full px-6 py-[0.6rem] text-white bg-indigo-900 rounded">
                Log In
            </button>
            <button className="w-full px-4 py-2 rounded-lg hover:text-blue-600">
                Forget your password?
            </button>
            <div className="relative">
                <hr className="my-5 border-t border-gray-300" />
                <span className="absolute px-2 -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 ">
                    Or
                </span>
            </div>
            <SocialLoginButton />
        </form>
    );
};

const Login = () => {
    return (
        <section className="bg-gradient-to-r from-[#a345d5] via-[#4c6ad5] to-[#a348d4] ezy__signup10 light py-14 md:py-24 text-zinc-900">
            <div className="container px-4 mx-auto">
                <div className="grid h-full grid-cols-6 gap-6">
                    <div className="col-span-6 md:col-span-2 lg:col-span-3">
                        <div
                            className="bg-cover bg-center bg-no-repeat min-h-[150px] rounded-xl hidden md:block w-full md:w-[200%] lg:w-[150%] h-full"
                            style={{
                                backgroundImage:
                                    `url(https://www.referbiz.in/assets/Employees-511dd0dc.jpg)`,
                            }}
                        ></div>
                    </div>
                    <div className="col-span-6 py-12 md:col-span-4 lg:col-span-3">
                        <div className="w-full h-full max-w-[29rem] mx-auto">
                            <div className="p-4 py-8 bg-white shadow-xl rounded-xl md:p-10">
                                <h2 className="mb-3 text-2xl font-bold text-indigo-900 ">
                                    Welcome to Refer Biz
                                </h2>
                                <div className="flex items-center mb-7">
                                    <p className="mb-0 mr-2 opacity-50">Don't have an account?</p>
                                    <Link to="/register" className="underline">Create Account</Link>
                                </div>

                                <SignInForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login