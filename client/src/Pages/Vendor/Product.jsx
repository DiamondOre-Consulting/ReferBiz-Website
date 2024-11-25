import { CgFontSpacing } from "react-icons/cg";
import HomeLayout from "../../Layout/HomeLayout";
import { MdClose } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSubCategories,
  listOfAllSubCategories,
} from "../../Redux/Slices/vendorSlice";
import { Dialog } from "@radix-ui/react-dialog";
import { SubCategoryModal } from "./SubCategoryModal";
import { useEffect, useState } from "react";
import { getVendorData } from "../../Redux/Slices/vendorSlice";
import { addSubCategories } from "../../Redux/Slices/vendorSlice";

export const Product = () => {
  const [isSubCategoryModalOpen, setisSubCategoryModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, SetItems] = useState([]);

  const listOfSubCategories = useSelector(
    (state) => state?.vendor?.listOfSubCategories
  );

  const vendorData = useSelector((state) => state?.vendor?.vendorData);
  const data = useSelector((state) => state?.auth?.data);
  // You can use vendorData here or any other logic

  const dispatch = useDispatch();
  console.log("vendor", listOfSubCategories.subCategory);
  console.log("vendordata", vendorData);
  console.log("data");

  const getSubCategoryList = async (id) => {
    await dispatch(listOfAllSubCategories(id));
    setisSubCategoryModalOpen(true);
  };

  const handleDelete = async (customerId, item) => {
    await dispatch(deleteSubCategories([customerId, { item }]));
    await dispatch(getVendorData(data._id));
    setCustomerId("");
  };

  const handleContactSelect = (updatedSelectedContacts) => {
    SetItems(updatedSelectedContacts);
  };

  useEffect(() => {
    dispatch(getVendorData(data._id));
  }, []);

  const handleConfirm = async () => {
    console.log("customer", customerId);
    await dispatch(addSubCategories([customerId, { items }]));
    await dispatch(getVendorData(data._id));
    setCustomerId("");
    console.log("Confirmed selected items:", items);
  };
  console.log("vendorproducts", vendorData?.products);

  return (
    <>
      <HomeLayout>
        <div className="text-gray-300 text-3xl py-2 text-center font-bold">
          Product List
        </div>
        {vendorData?.products?.map((product, index) => (
          <div
            key={index}
            className="max-w-7xl mx-auto h-auto shadow-2xl mt-5 p-6 border-[1px] rounded-lg border-gray-300 text-gray-300 "
          >
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold py-3">
                  {product?.category?.categoryName}
                </div>
                <div>
                  <button
                    title="Add New"
                    className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                    onClick={() => {
                      getSubCategoryList(product?.category?._id);
                      setCustomerId(product._id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50px"
                      height="50px"
                      viewBox="0 0 24 24"
                      className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
                    >
                      <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        strokeWidth="1.5"
                      ></path>
                      <path d="M8 12H16" strokeWidth="1.5"></path>
                      <path d="M12 16V8" strokeWidth="1.5"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Category Items */}
              <div className="flex flex-wrap gap-4">
                {product?.categoryList?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-blue-800 w-auto h-auto rounded-3xl text-xl px-4 py-2 flex items-center text-black font-semibold"
                  >
                    {item}
                    <MdClose
                      onClick={() => {
                        handleDelete(product._id, item);
                      }}
                      className="ml-2 cursor-pointer"
                      size={22}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </HomeLayout>
      <SubCategoryModal
        data={listOfSubCategories.subCategory}
        isOpen={isSubCategoryModalOpen}
        onClose={() => setisSubCategoryModalOpen(false)}
        selectedItems={items}
        onSelect={handleContactSelect}
        onConfirm={handleConfirm}
      />
    </>
  );
};
