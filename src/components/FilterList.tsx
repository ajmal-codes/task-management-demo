import { FilterState, User } from "@/types/types";
import React from "react";
import MultiSelect from "./MultiSelect";

interface FilterListProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  users:User[];
  labels: string[]; // Uncomment if labels are needed
}

const FilterList = ({ filters, setFilters,users,labels }: FilterListProps) => {
  const hasFilter = Object.values(filters).some(
    (value) => value !== "" && (Array.isArray(value) ? value.length > 0 : true)
  );
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-[#1e1e1e] rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Priority Filter */}
          <div className="flex items-center justify-between md:justify-start gap-2">
            <label className="block text-sm font-medium  whitespace-nowrap">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="md:w-full border bg-[#1e1e1e] border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500  w-1/2"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Due Date Filter */}
          <div className="flex items-center justify-between md:justify-start gap-2">
            <label className="block text-sm font-medium  whitespace-nowrap">
              Due Date
            </label>
            <select
              value={filters.dueDate}
              onChange={(e) =>
                setFilters({ ...filters, dueDate: e.target.value })
              }
              className="md:w-full w-1/2 bg-[#1e1e1e] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Dates</option>
              <option value="overdue">Overdue</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
            </select>
          </div>

          {/* User Filter */}
          <div className="flex items-center justify-between md:justify-start gap-2">
            <label className="block text-sm font-medium  whitespace-nowrap">
              Assigned To
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) =>
                setFilters({ ...filters, assignedTo: e.target.value })
              }
              className="md:w-full w-1/2 bg-[#1e1e1e] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Labels Filter */}
          <div className='flex items-center justify-between md:justify-start gap-2'>
                <label className="block text-sm font-medium  whitespace-nowrap">Labels</label>
                <div className="md:w-full w-1/2">
                <MultiSelect options={labels} selectedList={filters.labels} setSelect={(selected)=>setFilters({...filters, labels: selected})}/>
                </div>
                {/* <select
                  multiple
                  value={filters.labels}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters({...filters, labels: selected});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 'h-28'"
                >
                  {labels.map(label => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select> */}
              </div>
        </div>

        {hasFilter && (
          <div className="mt-4">
            <button
              onClick={() =>
                setFilters({
                  priority: "",
                  dueDate: "",
                  assignedTo: "",
                  labels: [],
                })
              }
              className="text-sm  hover:text-[#bbb9b9] cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterList;
