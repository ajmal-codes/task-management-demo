import React from "react";

interface MultiSelectDropdownProps {
  options: string[];
  selectedList: string[];
  setSelect: (lists: string[]) => void;
}

const MultiSelect = ({
  options,
  selectedList,
  setSelect,
}: MultiSelectDropdownProps) => {
  // Toggle a dropdown open/close
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newList = selectedList.includes(value)
      ? selectedList.filter((item) => item !== value)
      : [...selectedList, value]; // Deselect if already
    setSelect(newList);
  };

  const selectedString =  `${(selectedList?.length>3?selectedList.slice(0,3):selectedList).map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(", ")}${(selectedList?.length>3? ` + ${selectedList.length-3} more` : "")}`;

  return (
    <div className="relative inline-block text-left w-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen((prevState) => !prevState)}
        className="inline-flex justify-between w-full rounded-md border border-gray-300  px-4 py-2 text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
      >
        {selectedList.length === 0
          ? "Select "
        //   : `${selectedList.length} item(s) selected`}
          : selectedString}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full left-0 mt-2 origin-top-left rounded-md bg-[#1e1e1e] shadow-lg ring-1 ring-[#343434] ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {options.map((fruit) => (
              <label key={fruit} className="block px-4 py-2">
                <input
                  type="checkbox"
                  value={fruit}
                  checked={selectedList.includes(fruit)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {fruit.charAt(0).toUpperCase() + fruit.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
