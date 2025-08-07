"use client";
import { ColumnType, Task, User } from "@/types/types";
import React from "react";

interface TaskCardProps {
  task: Task;
  draggedTask: Task | null;
  draggedOverColumn: string | null;
  column: ColumnType;
  user: User|null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setShowTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const TaskCard = ({
  task,
  draggedTask,
  draggedOverColumn,
  column,
  user,
  handleDragEnd,
  handleDragStart,
  setEditingTask,
  setShowTaskModal,
}: TaskCardProps) => {
  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-300 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-200 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-300 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      className={`bg-[#2d2d2d] rounded-lg p-4 shadow-sm cursor-move hover:shadow transition-shadow ${
        draggedTask?.id === task.id ? "opacity-50" : ""
      } ${draggedOverColumn === column.id ? "bg-blue-50" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sm">{task.title}</h4>
        <button
          onClick={() => {
            setEditingTask(task);
            setShowTaskModal(true);
          }}
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
      </div>

      {task.description && (
        <p className="text-sm text-[#c5c5c5] mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {task.labels?.map((label) => (
          <span
            key={label}
            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span
          className={`px-2 py-1 rounded-full border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        <span>{task.dueDate}</span>
      </div>

      {user && (
        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm font-medium =">{user.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
