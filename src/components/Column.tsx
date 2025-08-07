import { ColumnType, DeleteConfirm, Task, User } from "@/types/types";
import React from "react";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  draggedTask: Task | null;
  draggedOverColumn: string | null;
  editingColumn: string | null;
  filteredTasks: Task[];
  users: User[];
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  handleDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  setEditingColumn: React.Dispatch<React.SetStateAction<string | null>>;
  updateColumn: (id: string, title: string) => void;
  setShowDeleteConfirm: React.Dispatch<DeleteConfirm>;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Column = ({
  column,
  draggedTask,
  draggedOverColumn,
  editingColumn,
  filteredTasks,
  users,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  handleDrop,
  setEditingColumn,
  updateColumn,
  setShowDeleteConfirm,
  setEditingTask,
  setShowTaskModal,
}: ColumnProps) => {
  const getColumnBg = (color="#1e1e1e") => {
    return `bg-[${color}]`;
  };

  const getColumnColor = (color = "#1e1e1e") => {
    // A simple check for dark or light based on hex color
    const isDark = (color: string) => {
      const hex = color.startsWith("#") ? color.slice(1) : color;
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return r * 0.299 + g * 0.587 + b * 0.114 < 186;
    };

    // If the background is dark, use light text, else use dark text
    const textColor = isDark(color) ? "text-white" : "text-gray-900";
    return `${textColor}`;
  };
  return (
    <div
      className={`flex-shrink-0 w-80 ${getColumnBg(
        column.color
      )} rounded-lg p-4`}
      onDragOver={(e) => handleDragOver(e, column.id)}
      onDrop={(e) => handleDrop(e, column.id)}
    >
      <div className="flex items-center justify-between mb-4">
        {editingColumn === column.id ? (
          <input
            type="text"
            defaultValue={column.title}
            onBlur={(e) => updateColumn(column.id, e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                updateColumn(column.id, e.target.value);
              }
            }}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <h3 className={`font-semibold ${getColumnColor(column.color)}`}>{column.title}</h3>
        )}
        <div className="flex space-x-1">
          <button
            onClick={() => setEditingColumn(column.id)}
            className="text-gray-400 hover:text-gray-600"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setShowDeleteConfirm({
                type: "column",
                id: column.id,
                name: column.title,
              })
            }
            className="text-gray-400 hover:text-red-600"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks
          .filter((task) => task.status === column.id)
          .sort((a, b) => a.order - b.order)
          .map((task) => {
            const user = users.find((u) => u.id === task.assignedTo);
            return (
              <TaskCard
                key={task.id}
                column={column}
                task={task}
                user={user || null}
                draggedTask={draggedTask}
                draggedOverColumn={draggedOverColumn}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                setEditingTask={setEditingTask}
                setShowTaskModal={setShowTaskModal}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Column;
