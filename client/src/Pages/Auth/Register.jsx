import React, { useState, Fragment } from "react";

import { IoLogoFacebook } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
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

const SignUpForm = () => {


    const handleSubmit = (e) => {
        e.preventDefault()

    }

    return (
        <form noValidate onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="first-name" className="mb-1 text-[0.85rem]  font-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="first-name"
                            placeholder="Your Full Name"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="first-name" className="mb-1 text-[0.85rem]  font-semibold">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="first-name"
                            placeholder="Your Phone Number"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="email" className="mb-1 text-[0.85rem]  font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="email"
                            placeholder="Email"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="password" className="mb-1 text-[0.85rem]  font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="password"
                            placeholder="Password"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-6">
                        <label htmlFor="con-pass" className="mb-1 text-[0.85rem]  font-semibold">
                            Confirm Password
                        </label>
                        <input
                            type="text"
                            className="px-4 leading-10 rounded-md bg-blue-50 focus:outline-none focus:border focus:border-blue-600 "
                            id="con-pass"
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 text-white bg-indigo-800 rounded px-7"
            >
                Sign Up
            </button>

            <div className="relative">
                <hr className="my-6 border-gray-400 md:my-12" />
                <span className="absolute px-2 -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 ">
                    Or
                </span>
            </div>

            <SocialLoginButton />
        </form>
    );
};

const Register = () => {
    return (
        <section className="bg-gradient-to-r from-[#a345d5] via-[#4c6ad5] to-[#a348d4]  ezy__signup10 light py-14 md:py-24 text-zinc-900 ">
            <div className="container px-4 mx-auto">
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
                    <div className="col-span-6 py-12 md:col-span-4 lg:col-span-3">
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
    );
};

export default Register