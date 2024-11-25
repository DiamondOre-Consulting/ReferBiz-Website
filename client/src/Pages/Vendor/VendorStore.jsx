import HomeLayout from "../../Layout/HomeLayout";
import { useSelector, useDispatch } from "react-redux";

export const VendorStore = () => {
  return (
    <>
      <HomeLayout>
        <div className="text-gray-300 text-3xl py-2 text-center font-bold">
          Vendor Store
        </div>
      </HomeLayout>
    </>
  );
};
