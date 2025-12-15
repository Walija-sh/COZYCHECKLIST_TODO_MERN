// FilterMenu.jsx
import React from 'react';
import { Check } from 'lucide-react';

const FilterMenu = ({ filterStatus, filterPriority, onStatusChange, onPriorityChange, onClose, onClearFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />
      <div className="absolute top-full right-0 bg-white border border-[#E6E6E9] rounded-lg shadow-lg p-6 mb-6 z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Filter */}
          <div>
            <h4 className="font-semibold text-[#1C1C1C] mb-3">Tasks</h4>
            <div className="space-y-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-[#F4F4F6] rounded"
                >
                  {filterStatus === option.value ? (
                    <div className="w-5 h-5 bg-[#5465FF] rounded flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-[#E6E6E9] rounded" />
                  )}
                  <span className="text-[#1C1C1C]">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="font-semibold text-[#1C1C1C] mb-3">Priority</h4>
            <div className="space-y-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => onPriorityChange(option.value)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-[#F4F4F6] rounded"
                >
                  {filterPriority === option.value ? (
                    <div className="w-5 h-5 bg-[#5465FF] rounded flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-[#E6E6E9] rounded" />
                  )}
                  <span className="text-[#1C1C1C] capitalize">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-6 pt-4 border-t border-[#E6E6E9]">
          <button
            onClick={onClearFilters}
            className="text-[#5465FF] hover:text-[#4351CC] text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;