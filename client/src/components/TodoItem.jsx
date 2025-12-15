// TodoItem.jsx
import React, { useState } from 'react';
import { Check, Circle, AlertCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'medium':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'low':
        return <AlertCircle size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getPriorityText = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className="bg-white border border-[#E6E6E9] rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(todo)}
          className="mt-1 flex-shrink-0"
        >
          {todo.completed ? (
            <div className="w-6 h-6 bg-[#5465FF] rounded-full flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
          ) : (
            <Circle size={24} className="text-[#E6E6E9]" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-[#1C1C1C] ${todo.completed ? 'line-through text-[#66666E]' : ''}`}>
                {todo.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getPriorityIcon(todo.priority)}
                <span className={`text-sm font-medium ${
                  todo.priority === 'high' ? 'text-red-600' :
                  todo.priority === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {getPriorityText(todo.priority)}
                </span>
                
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative flex-shrink-0 ml-2">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-[#F4F4F6] rounded"
              >
                <MoreVertical size={20} className="text-[#66666E]" />
              </button>

              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowActions(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E6E6E9] rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        onEdit();
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-[#1C1C1C] hover:bg-[#F4F4F6] transition"
                    >
                      <Edit2 size={16} />
                      Update
                    </button>
                    <button
                      onClick={() => {
                        onDelete(todo._id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-[#F4F4F6] transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;