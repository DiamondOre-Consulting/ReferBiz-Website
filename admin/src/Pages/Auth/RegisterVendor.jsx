import React, { useState, Fragment } from "react";
import HomeLayout from "../../Layout/HomeLayout";



const SignUpForm = () => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <form noValidate onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-3">
                        <label htmlFor="first-name" className="mb-1 text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="full-name"
                            placeholder="Your First Name"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-3">
                        <label htmlFor="last-name" className="mb-1 text-gray-300">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="shop-name"
                            placeholder="Your Shop Name"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-3">
                        <label htmlFor="email" className="mb-1 text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="email"
                            placeholder="Email"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-3">
                        <label htmlFor="email" className="mb-1 text-gray-300">
                            Phone number
                        </label>
                        <input
                            type="number"
                            className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="email"
                            placeholder="Phone number"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-3">
                        <label htmlFor="password" className="mb-1 text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="password"
                            placeholder="Password"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col mx-2 mb-4">
                        <label htmlFor="con-pass" className="mb-1 text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="text"
                            className="bg-[#1D222B]   rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="con-pass"
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>
                <div className="w-full ">
                    <div className="flex flex-col mx-2 mb-4">
                        <label htmlFor="con-pass" className="mb-1 text-gray-300">
                            MAP i-frame
                        </label>
                        <textarea
                            type="text"
                            rows={2}
                            className="bg-[#1D222B] resize-none   rounded  leading-10 px-4 focus:outline-none border border-borderDark "
                            id="con-pass"
                            placeholder="Map i-frame"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 text-white bg-[#6761D9] rounded px-7"
            >
                Register Vendor
            </button>


        </form>
    );
};

const RegisterVendor = () => {
    return (
        <HomeLayout>
            <section className="flex items-center py-10 overflow-hidden bg-transparent ezy__signup1 md:w-custom light text-zinc-900">
                <div className="container px-4 mx-auto">
                    <div className="flex justify-center">
                        <div className="w-full max-w-2xl">
                            <div className="p-4 relative shadow-xl overflow-hidden pt-20 bg-[#212631] border border-borderDark rounded-xl">
                                <h2 className="absolute top-0 left-0 w-full p-[0.4rem] mb-3 text-[1.35rem] bg-[#D04848] font-[400] text-center text-white md:mb-12">
                                    Register Vendor
                                </h2>

                                <SignUpForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
};

export default RegisterVendor
