// TodoInput.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

const TodoInput = ({ onAdd, initialText = '', initialPriority = 'high', isUpdateMode = false, onCancel }) => {
  const [text, setText] = useState(initialText);
  const [priority, setPriority] = useState(initialPriority);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const priorities = [
    { value: 'high', label: 'High', color: 'text-red-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'low', label: 'Low', color: 'text-green-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      if (!isUpdateMode) {
        setText('');
        setPriority('high');
      }
    }
  };

  useEffect(() => {
    setText(initialText);
    setPriority(initialPriority);
  }, [initialText, initialPriority]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 border border-[#1C1C1C] placeholder:text-[#66666E] focus:border-[#5465FF] focus:outline-none"
            autoFocus={isUpdateMode}
          />
        </div>

        {/* Priority Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            className="flex items-center gap-2 px-4 py-3 border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F4F6] transition w-full lg:w-auto"
          >
            
            <span className="capitalize">{priority}</span>
            <ChevronDown size={20} />
          </button>

          {showPriorityMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPriorityMenu(false)}
              />
              <div className="absolute left-0 lg:left-auto lg:right-0 mt-1 w-full lg:w-48 bg-white border border-[#E6E6E9] rounded-lg shadow-lg z-50">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      setPriority(p.value);
                      setShowPriorityMenu(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#F4F4F6] transition ${
                      priority === p.value ? 'bg-[#F4F4F6]' : ''
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${p.color} bg-current`} />
                    <span className="text-[#1C1C1C]">{p.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Add/Update Button */}
        <button
          type="submit"
          className="bg-[#5465FF] border-t-4 border-b-4 border-t-[#7684FF] border-b-[#4351CC] text-white px-6 py-3 font-medium cursor-pointer hover:opacity-95 transition flex items-center justify-center gap-2 w-full lg:w-auto"
        >
          {isUpdateMode ? (
            <>
              <span>UPDATE</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>ADD TASK</span>
            </>
          )}
        </button>

        {/* Cancel Button (for update mode) */}
        {isUpdateMode && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-3 border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F4F6] transition"
          >
            <X size={20} />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoInput;