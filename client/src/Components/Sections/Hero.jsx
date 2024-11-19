import React, { useState } from "react"
import { MdOutlineSearch } from "react-icons/md"
import { useDispatch } from "react-redux"
import { getVendorListByLocation } from "../../Redux/Slices/vendorSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Hero = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [locationValue, setLocationValue] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!locationValue) {
      return toast.error("Please enter location!")
    }

    const res = await dispatch(
      getVendorListByLocation({ nearByLocation: locationValue })
    )

    if (res.payload.success) {
      navigate("/vendor-list", {
        state: {
          location: locationValue,
        },
      })
    }
  }

  return (
    <div className="bg-gradient-to-r flex relative overflow-hidden items-center justify-center from-[#281996] via-[#140A64] to-[#281996] font-poppins min-h-[100vh]">
      <div className="absolute bg-[#082ec4] blur-3xl  rounded-full w-[30vw] h-[50vh] top-[-6rem] left-[-1rem]"></div>
      <div className="absolute bg-[#082ec4d4] blur-3xl rounded-full w-[30vw] h-[50vh] bottom-[-6rem] right-0"></div>

      <main
        className={`relative h-full backdrop-blur-md w-full overflow-hidden z-[100] `}
      >
        <div
          className={` z-[100]  pb-0 flex w-full h-full  items-center object-cover flex-col justify-between  text-white py-[1rem] gap-2`}
        >
          <div className="flex flex-col max-w-[40rem] container border-white z-[100] items-center justify-center gap-3 w-[100%]">
            <h1
              data-aos="fade-left"
              className="tracking-[1px] font-roboto p-[2px] px-4 rounded-full text-[3rem] text-center  text-red font-[800] capitalize"
            >
              Referral revolution where we play, earn, and learn
            </h1>
            <p
              data-aos="fade-right"
              data-aos-duration="900"
              className="text-[1.1rem] mt-4
     text-center"
            >
              {" "}
              Unleash the power of ReferBiz! It's not just a platform, it's a
              lifestyle that lets you play, earn, and learn, all in one place.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex bg-white rounded-full  w-fit items-center text-[0.9rem] gap-2 justify-center p-1  mt-8"
            >
              <input
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                placeholder="Enter location..."
                className="px-4 w-[16rem] sm:w-[20rem] text-black outline-none"
              />
              <button
                type="submit"
                className="p-[0.65rem] px-5 text-[1.1rem] flex items-center justify-center gap-2 bg-light rounded-full tracking-wide bg-red relative z-[10000]"
              >
                <MdOutlineSearch className="text-[1.3rem]" /> Search
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* <BlogPage /> */}
    </div>
  )
}

export default Hero
