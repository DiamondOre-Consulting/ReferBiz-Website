import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../Components/Dialogue";
import { CiSearch } from "react-icons/ci";
import { getCategoryList } from "../../Redux/Slices/vendorSlice";

export const SearchBox = ({ searchTerm, onSearch }) => {
  return (
    <div className="w-full">
      <div className="bg-neutral-200 w-full md:w-[441px] h-[38px] rounded-[8px] border-1 border-neutral-200 flex items-center justify-between px-4 py-3 text-primary-be">
        <span className="font-[400] text-[15px] leading-[22.5px] text-primary-be ">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-primary-be w-full md:w-[300px] text-[15px] placeholder:text-primary-be"
            placeholder="Search across the contacts"
          />
        </span>
        <CiSearch size={18} />
      </div>
    </div>
  );
};

export const SubCategoryModal = ({
  data = [],
  onConfirm,
  onSelect,
  selectedItems = [],
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleContactSelect = (contact) => {
    const updatedSelectedContacts = selectedItems.includes(contact)
      ? selectedItems.filter((item) => item !== contact)
      : [...selectedItems, contact];

    if (onSelect) {
      onSelect(updatedSelectedContacts);
    }
  };

  const filteredData = data.filter((contact) =>
    contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    const updatedSelectedItems =
      selectedItems.length === filteredData.length ? [] : filteredData;
    if (onSelect) {
      onSelect(updatedSelectedItems);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger></DialogTrigger>
      <DialogContent className="bg-white sm:w-[px] rounded-[20px] max-h-[652px] py-[20px] px-[24px]">
        <DialogHeader>
          <DialogTitle className="text-primary-be font-[500] text-[18px] leading-[27px]">
            Please Select Subcategories
            <div className="border-t border-neutral-300 text-neutral-300 mt-2"></div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-[18px]">
          <SearchBox searchTerm={searchTerm} onSearch={setSearchTerm} />

          <p className="text-primary-be text-[18px] font-[400] leading-[22.5px] opacity-[.48]">
            List of {filteredData.length} contacts imported from Gmail
          </p>
        </div>
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-[16px] h-[16px] form-checkbox cursor-pointer mr-2 accent-primary-be"
              checked={
                filteredData.length !== 0 &&
                selectedItems.length === filteredData.length
              }
              onChange={handleSelectAll}
            />
            <div className="text-primary-b900 font-[400] text-[18px] leading-[22.5px]">
              Select All
            </div>
          </div>

          <div className="border-t border-neutral-300 mt-2"></div>
        </div>

        <div className="max-h-72 h-[188px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
          {filteredData.map((contact, index) => (
            <div
              key={index}
              className={`flex items-center rounded-md py-4 transition-colors duration-200 w-full md:w-[407px] h-[20px] mb-[12px]`}
            >
              <input
                type="checkbox"
                className="w-[16px] h-[16px] form-checkbox cursor-pointer mr-2 accent-primary-be" // Custom color on checked state
                checked={selectedItems.includes(contact)}
                onClick={() => handleContactSelect(contact)}
                readOnly
              />

              <div className="text-black font-[400]  text-[18px] leading-[22.5px]">
                {contact}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-2">
          <div className="flex items-center">
            {selectedItems.length > 0 && (
              <button className="text-primary-be font-[500] text-[15px]">
                {selectedItems.length} selected
              </button>
            )}
          </div>

          <button
            className={`h-[32px] w-[94px] rounded-[8px] py-[2px] px-[12px] text-gray-100 ${
              selectedItems.length === 0 ? "bg-gray-100" : "bg-gray-600"
            }`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
