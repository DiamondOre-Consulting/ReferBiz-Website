import React, { useState } from "react"
import Header from "../Components/Header"

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form className="" noValidate onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          className="min-h-[48px] leading-[48px] bg-[#F2F6FD]  border border-transparent rounded-md focus:outline-none focus:border focus:border-[#195ec6] w-full px-3"
          placeholder="Enter Name"
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          className="min-h-[48px] leading-[48px] bg-[#F2F6FD]  border border-transparent rounded-md focus:outline-none focus:border focus:border-[#195ec6] w-full px-3"
          placeholder="Enter Email"
        />
      </div>
      <div className="mb-4">
        <textarea
          name="message"
          className=" leading-[48px] bg-[#F2F6FD]  border border-transparent rounded-md focus:outline-none focus:border focus:border-[#195ec6] w-full px-3"
          placeholder="Enter Message"
          rows="3"
        ></textarea>
      </div>
      <div className="text-start">
        <button
          type="submit"
          className="px-8 py-[0.6rem] w-full mb-4 text-white bg-indigo-600 rounded hover:bg-opacity-90"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

const ContactFormCard = () => (
  <div className="bg-white  rounded-xl max-w-[28rem] border-[12px]  border-[#e9effc] p-4">
    <h2 className="text-2xl md:text-[35px] leading-none font-semibold mb-2">
      Contact Us
    </h2>
    <p className="mb-6 text-md">We will reach you within few hours.</p>

    <ContactForm />
  </div>
)

const Contact = () => {
  return (
    <>
      <Header />
      <section className="bg-gradient-to-r pt-10 flex flex-col relative overflow-hidden items-center justify-center from-[#281996] via-[#140A64] to-[#281996] font-poppins min-h-[100vh]">
        <div className="absolute bg-[#082ec4] blur-3xl  rounded-full w-[30vw] h-[50vh] top-[-6rem] left-[-1rem]"></div>
        <div className="absolute bg-[#082ec4d4] blur-3xl rounded-full w-[30vw] h-[50vh] bottom-[-6rem] right-0"></div>

        <div className="container relative px-4 mt-10">
          <div className="grid grid-cols-12 py-6">
            <div className="col-span-12 mt-4 mb-12 lg:mt-10 lg:col-span-4 lg:mb-0 lg:pl-20">
              <h2 className="text-[2rem] leading-none font-bold md:text-[50px] mb-6 text-white">
                Get in Touch
              </h2>
              <p className="text-lg text-white">
                It’s easier to reach your savings goals when you have the right
                savings account. Take a look and find the right one for you!
              </p>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              <ContactFormCard />
            </div>
          </div>
        </div>
        <iframe
          className="w-full h-[23rem]"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.408536983902!2d77.37801187461689!3d28.61751547567284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce59b05aacacf%3A0x3bf4ac13c4a83af6!2sReliable%20Allied%20Services!5e0!3m2!1sen!2sin!4v1731149238848!5m2!1sen!2sin"
          allowfullscreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  )
}

export default Contact
