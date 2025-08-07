"use client";
import Column from "@/components/Column";
import FilterList from "@/components/FilterList";
import TaskModal from "@/components/TaskModal";
import UserModal from "@/components/UserModal";
import React, { useState, useEffect, useRef } from "react";

// TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Column {
  id: string;
  title: string;
  order: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  labels: string[];
  assignedTo: string | null;
  order: number;
  createdAt: string;
}

interface FilterState {
  priority: string;
  dueDate: string;
  assignedTo: string;
  labels: string[];
}

interface DeleteConfirm {
  type: "task" | "column" | "user";
  id: string;
  name: string;
}

export default function Home() {
  // Initial data
  const initialUsers: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "https://placehold.co/40/3B82F6/FFFFFF?text=AJ",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "https://placehold.co/40/EF4444/FFFFFF?text=BS",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@example.com",
      avatar: "https://placehold.co/40/10B981/FFFFFF?text=CD",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@example.com",
      avatar: "https://placehold.co/40/F59E0B/FFFFFF?text=DW",
    },
  ];

  const initialColumns: Column[] = [
    { id: "1", title: "To Do", order: 1 },
    { id: "2", title: "In Progress", order: 2 },
    // { id: '3', title: 'Review', order: 3 },
    { id: "4", title: "Completed", order: 4 },
  ];

  const initialTasks: Task[] = [
    {
      id: "1",
      title: "Design homepage mockup",
      description: "Create wireframes and design for the new homepage",
      status: "1",
      dueDate: "2023-12-15",
      priority: "High",
      labels: ["Design", "Frontend"],
      assignedTo: "1",
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Implement user authentication",
      description: "Set up login and registration system with JWT",
      status: "2",
      dueDate: "2023-12-20",
      priority: "High",
      labels: ["Backend", "Security"],
      assignedTo: "2",
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Write API documentation",
      description: "Document all endpoints with examples and parameters",
      status: "3",
      dueDate: "2023-12-18",
      priority: "Medium",
      labels: ["Documentation"],
      assignedTo: "3",
      order: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  // State
  // const [users, setUsers] = useState<User[]>(() => {
  //   const saved = localStorage.getItem("kanban-users");
  //   return saved ? JSON.parse(saved) : initialUsers;
  // });

  // const [columns, setColumns] = useState<Column[]>(() => {
  //   const saved = localStorage.getItem("kanban-columns");
  //   return saved ? JSON.parse(saved) : initialColumns;
  // });

  // const [tasks, setTasks] = useState<Task[]>(() => {
  //   const saved = localStorage.getItem("kanban-tasks");
  //   return saved ? JSON.parse(saved) : initialTasks;
  // });

  const [users, setUsers] = useState<User[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRendered,setIsRendered] = useState<boolean>(false);

  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<FilterState>({
    priority: "",
    dueDate: "",
    assignedTo: "",
    labels: [],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState<DeleteConfirm | null>(null);
  const [activeTab, setActiveTab] = useState<"board" | "filters">("board");

useEffect(() => {
  // Client-side check to access localStorage
  const savedUsers = localStorage.getItem("kanban-users");
  const savedColumns = localStorage.getItem("kanban-columns");
  const savedTasks = localStorage.getItem("kanban-tasks");

  if (savedUsers) {
    setUsers(JSON.parse(savedUsers));
  } else {
    setUsers(initialUsers);  // Fallback to initial users if nothing is saved
  }

  if (savedColumns) {
    setColumns(JSON.parse(savedColumns));
  } else {
    setColumns(initialColumns);  // Fallback to initial columns if nothing is saved
  }

  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  } else {
    setTasks(initialTasks);  // Fallback to initial tasks if nothing is saved
  }
  setIsRendered(true)
}, []);
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("kanban-columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kanban-users", JSON.stringify(users));
  }, [users]);

  // Task operations
  const createTask = (taskData: Omit<Task, "id" | "order" | "createdAt">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      order: tasks.filter((t) => t.status === taskData.status).length + 1,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setShowDeleteConfirm(null);
  };

  // Column operations
  const addColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: newColumnTitle.trim(),
        order: columns.length + 1,
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
    }
  };

  const updateColumn = (id: string, title: string) => {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
    setEditingColumn(null);
  };

  const deleteColumn = (id: string) => {
    const column = columns.find((col) => col.id === id);
    if (column) {
      // Move tasks to first column or delete them
      const tasksInColumn = tasks.filter((task) => task.status === id);
      const firstColumnId = columns.find((col) => col.id !== id)?.id;

      if (firstColumnId) {
        setTasks(
          tasks.map((task) =>
            task.status === id ? { ...task, status: firstColumnId } : task
          )
        );
      } else {
        setTasks(tasks.filter((task) => task.status !== id));
      }

      setColumns(columns.filter((col) => col.id !== id));
      setShowDeleteConfirm(null);
    }
  };

  // User operations
  const addUser = (userData: Omit<User, "id" | "avatar">) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      avatar: `https://placehold.co/40/3B82F6/FFFFFF?text=${userData.name.charAt(
        0
      )}`,
    };
    setUsers([...users, newUser]);
    setEditingUser(null);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
    setEditingUser(null);
  };

  const deleteUser = (id: string) => {
    // Reassign tasks to first user or unassign
    const firstUserId = users.find((u) => u.id !== id)?.id || null;
    setTasks(
      tasks.map((task) =>
        task.assignedTo === id ? { ...task, assignedTo: firstUserId } : task
      )
    );
    setUsers(users.filter((user) => user.id !== id));
    setShowDeleteConfirm(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== columnId) {
      // Update task status
      updateTask(draggedTask.id, { status: columnId });

      // Reorder tasks in both columns
      const tasksInNewColumn = tasks.filter((t) => t.status === columnId);
      const tasksInOldColumn = tasks.filter(
        (t) => t.status === draggedTask.status && t.id !== draggedTask.id
      );

      // Update order for new column
      setTasks((prev) =>
        prev.map((task) => {
          if (task.status === columnId) {
            return {
              ...task,
              order: tasksInNewColumn.findIndex((t) => t.id === task.id) + 1,
            };
          }
          if (
            task.status === draggedTask.status &&
            task.id !== draggedTask.id
          ) {
            return {
              ...task,
              order: tasksInOldColumn.findIndex((t) => t.id === task.id) + 1,
            };
          }
          return task;
        })
      );
    }
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  // Filter tasks

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch =
      !filters.priority || task.priority === filters.priority;
    const dueDateMatch =
      !filters.dueDate ||
      (filters.dueDate === "overdue" && new Date(task.dueDate) < new Date()) ||
      (filters.dueDate === "today" &&
        task.dueDate === new Date().toISOString().split("T")[0]) ||
      (filters.dueDate === "this-week" &&
        new Date(task.dueDate) <=
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const userMatch =
      !filters.assignedTo || task.assignedTo === filters.assignedTo;
    const labelMatch =
      filters.labels.length === 0 ||
      filters.labels.some((label) => task.labels.includes(label));

    return priorityMatch && dueDateMatch && userMatch && labelMatch;
  });

  // Get unique labels for filtering
  const allLabels = [...new Set(tasks.flatMap((task) => task.labels || []))];



  // form submit handler

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      dueDate: formData.get("dueDate") as string,
      priority: formData.get("priority") as "High" | "Medium" | "Low",
      labels:
        (formData.get("labels") as string)
          ?.split(",")
          .map((l) => l.trim())
          .filter((l) => l) || [],
      assignedTo: formData.get("assignedTo") as string,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      createTask(taskData);
    }

    setShowTaskModal(false);
    setEditingTask(null);
  };

  if(!isRendered) {
    return null;
  }
  return (
    <div className="min-h-screen ">
      <header className="bg-[#1e1e1e] shadow-sm ">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold ">Task Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>New Task</span>
              </button>
              <button
                onClick={() => setShowUserModal(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-people"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}

      <FilterList labels={allLabels} users={users} setFilters={setFilters} filters={filters} />

      {/* Tasks */}

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">

          {/* Columns */}
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              draggedTask={draggedTask}
              draggedOverColumn={draggedOverColumn}
              editingColumn={editingColumn}
              setEditingColumn={setEditingColumn}
              updateColumn={updateColumn}
              setShowDeleteConfirm={setShowDeleteConfirm}
              handleDragEnd={handleDragEnd}
              handleDragOver={(e) => handleDragOver(e, column.id)}
              handleDragStart={(e, task) => handleDragStart(e, task)}
              handleDrop={(e) => handleDrop(e, column.id)}
              setEditingTask={setEditingTask}
              setShowTaskModal={setShowTaskModal}
              users={users}
              filteredTasks={filteredTasks}
            />
          ))}

          {/* Add Column */}
          <div className="flex-shrink-0 w-80">
            <div className="bg-[#1e1e1e] rounded-lg p-4 h-full">
              <input
                type="text"
                placeholder="New column title..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addColumn();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <button
                onClick={addColumn}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          editingTask={editingTask}
          users={users}
          columns={columns}
          handleSubmit={handleSubmit}
        />
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          users={users}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          addUser={addUser}
          updateUser={updateUser}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {showDeleteConfirm.type} "
              {showDeleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === "task") {
                    deleteTask(showDeleteConfirm.id);
                  } else if (showDeleteConfirm.type === "column") {
                    deleteColumn(showDeleteConfirm.id);
                  } else if (showDeleteConfirm.type === "user") {
                    deleteUser(showDeleteConfirm.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
