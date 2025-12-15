import React, { useState, useEffect, useRef } from "react";
import { Filter, Circle } from "lucide-react";
import TodoItem from "../components/TodoItem";
import TodoInput from "../components/TodoInput";
import FilterMenu from "../components/FilterMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { useMemo } from "react";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // 🔹 used to generate stable client-side IDs for optimistic todos
  const tempIdRef = useRef(0);

 const sortTodos = (todos) => {
  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
  };

  return [...todos].sort((a, b) => {
    // completed always last
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // both completed → keep relative order
    if (a.completed && b.completed) return 0;

    // both not completed → sort by priority
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};



  /* =======================
     INITIAL LOAD (NO CHANGE IN INTENT, BETTER SAFETY)
  ======================== */
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        { withCredentials: true }
      );

      if (res.data.success) {

        setTodos(res.data.tasks);
        
        
      }
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* =======================
     ADD TODO (REAL OPTIMISTIC LOGIC)
  ======================== */
  const handleAddTodo = async (title, priority) => {
    if (!title.trim()) return;

    // ✅ create temp todo with client-only id
    const tempId = `temp-${tempIdRef.current++}`;
    const tempTodo = {
      _id: tempId,
      title,
      priority,
      completed: false,
      isTemp: true, // 🔹 explicit marker
    };

    // ✅ optimistic UI update
    setTodos((prev) => [tempTodo, ...prev]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        { title, priority },
        { withCredentials: true }
      );

      if (res.data.success) {
        //  replace ONLY the temp todo (no refetch)
        setTodos((prev) =>
          prev.map((todo) => (todo._id === tempId ? res.data.task : todo))
        );
      }
    } catch (err) {
      //  rollback on failure
      setTodos((prev) => prev.filter((todo) => todo._id !== tempId));
      toast.error("Failed to add task");
    }
  };

  /* =======================
     TOGGLE COMPLETE (NO REFRESH, SAFE ROLLBACK)
  ======================== */
  const handleToggleComplete = async (todo) => {
    const original = todo.completed;

    // ✅ optimistic toggle
    setTodos((prev) =>
      prev.map((t) =>
        t._id === todo._id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${todo._id}`,
        { completed: !original },
        { withCredentials: true }
      );
    } catch (err) {
      // ✅ rollback on failure
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, completed: original } : t
        )
      );
      toast.error("Failed to update task");
    }
  };

  /* =======================
     UPDATE TODO (FIXED DATA CORRUPTION BUG)
  ======================== */
  const handleUpdateTodo = async (id, title, priority) => {
    const previous = todos.find((t) => t._id === id);

    // ✅ optimistic update (correct field name)
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, title, priority } : todo
      )
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
        { title, priority },
        { withCredentials: true }
      );
    } catch (err) {
      // ✅ rollback to exact previous state
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? previous : todo))
      );
      toast.error("Failed to update task");
    } finally {
      setEditingTodo(null);
      setIsUpdateMode(false);
    }
  };

  /* =======================
     DELETE TODO (SAFE ROLLBACK)
  ======================== */
  const handleDeleteTodo = async (id) => {
    const removed = todos.find((t) => t._id === id);

    // ✅ optimistic remove
    setTodos((prev) => prev.filter((todo) => todo._id !== id));

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
        { withCredentials: true }
      );
    } catch (err) {
      // ✅ rollback
      setTodos((prev) => [removed, ...prev]);
      toast.error("Failed to delete task");
    }
  };

  /* =======================
     FILTERING and sort )
  ======================== */
  const sortedTodos = useMemo(() => {
  return sortTodos(todos);
}, [todos]);

  const filteredTodos = useMemo(() => {
  return sortedTodos.filter((todo) => {
    if (filterStatus === "completed" && !todo.completed) return false;
    if (filterStatus === "pending" && todo.completed) return false;
    if (filterPriority && todo.priority !== filterPriority) return false;
    return true;
  });
}, [sortedTodos, filterStatus, filterPriority]);


  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  /* =======================
     RENDER
  ======================== */
  if (isLoading) {
    return <div className="p-10 text-center">Loading tasks…</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}{" "}
        <div className="mb-8">
          {" "}
          <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">
            {" "}
            Welcome Back!{" "}
          </h1>{" "}
          <p className="text-[#66666E]">
            {" "}
            Manage and organize your tasks{" "}
          </p>{" "}
        </div>
        {/* Statistics */}{" "}
        <div className=" p-4 rounded-lg mb-6">
          {" "}
          <div className="flex flex-wrap gap-4 justify-center text-[#1C1C1C]">
            {" "}
            <div className="flex items-center gap-2 ">
              {" "}
              <Circle size={16} className="text-[#5465FF]" />{" "}
              <span className="font-semibold">total {totalTodos}</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <Circle size={16} className="text-[#5465FF]" />{" "}
              <span className="font-semibold">completed {completedTodos}</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <Circle size={16} className="text-[#5465FF]" />{" "}
              <span className="font-semibold">pending {pendingTodos}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className="mb-6">
          {" "}
          <h2 className="text-xl font-semibold text-[#1C1C1C] mb-4">
            {" "}
            What needs to be done?{" "}
          </h2>
        </div>
        {/* Input */}
        {!isUpdateMode ? (
          <TodoInput onAdd={handleAddTodo} />
        ) : (
          <TodoInput
            onAdd={(t, p) => handleUpdateTodo(editingTodo._id, t, p)}
            initialText={editingTodo.title}
            initialPriority={editingTodo.priority}
            isUpdateMode
            onCancel={() => {
              setEditingTodo(null);
              setIsUpdateMode(false);
            }}
          />
        )}
        {/* Filters */}
        <div className="flex items-center justify-between relative">
          {" "}
          <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Tasks</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 text-[#1C1C1C] hover:bg-[#F4F4F6] transition"
          >
            <Filter size={20} />
          </button>
          {/* Filters Dropdown */}
          {showFilters && (
            <FilterMenu
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              onStatusChange={setFilterStatus}
              onPriorityChange={setFilterPriority}
              onClose={() => setShowFilters(false)}
              onClearFilters={() => {
                setFilterStatus("all");
                setFilterPriority(null);
              }}
            />
          )}
        </div>
        {/* List */}
        <div className="space-y-3 mt-6">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={() => {
                setEditingTodo(todo);
                setIsUpdateMode(true);
              }}
              onDelete={() => handleDeleteTodo(todo._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
