import HomeLayout from "../../Layout/HomeLayout";
import { MdClose } from "react-icons/md";

export const Product = () => {
  return (
    <>
      <HomeLayout>
        <div className="text-gray-300 text-5xl py-2 text-center font-bold">
          Product List
        </div>
        <div className="max-w-7xl mx-auto h-auto shadow-2xl mt-20 p-6 border-[1px] rounded-lg border-gray-300 text-gray-300 ">
          <div className="flex justify-between items-center">
            <div className="text-3xl  font-bold py-3">Electronics</div>
            <div className="">
              <button
                title="Add New"
                class="group cursor-pointer outline-none hover:rotate-90 duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50px"
                  height="50px"
                  viewBox="0 0 24 24"
                  class="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke-width="1.5"
                  ></path>
                  <path d="M8 12H16" stroke-width="1.5"></path>
                  <path d="M12 16V8" stroke-width="1.5"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-12 text-black font-semibold">
            <div className="bg-blue-800 w-auto h-auto rounded-3xl text-xl px-4 py-2 flex items-center">
              Register
              <MdClose className="ml-2 cursor-pointer" size={22} />
            </div>
            <div className="bg-blue-800 w-auto h-auto rounded-3xl text-xl px-4 py-2 flex items-center">
              Register
              <MdClose className="ml-2 cursor-pointer" size={22} />
            </div>
            <div className="bg-blue-800 w-auto h-auto rounded-3xl text-xl px-4 py-2 flex items-center">
              Register
              <MdClose className="ml-2 cursor-pointer" size={22} />
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};
