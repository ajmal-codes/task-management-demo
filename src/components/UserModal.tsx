import { DeleteConfirm, User } from "@/types/types";
import React from "react";

interface UserModalProps {
    onClose: () => void;
    users: User[];
    editingUser: string | null;
    setEditingUser: React.Dispatch<React.SetStateAction<string | null>>;
    addUser: (user: Omit<User, "id" | "avatar">) => void;
    updateUser: (id: string, user: Partial<User>) => void;
    setShowDeleteConfirm: React.Dispatch<DeleteConfirm>;
}
const UserModal = ({users,onClose,editingUser,setEditingUser,addUser,updateUser,setShowDeleteConfirm}:UserModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e1e1e] rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              User Management
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Add/Edit User Form */}
          {editingUser !== null ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const userData = {
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                };

                if (editingUser === "new") {
                  addUser(userData);
                } else {
                  updateUser(editingUser, userData);
                }
              }}
              className="mb-8 p-4 bg-[#323232] rounded-lg"
            >
              <h3 className="text-lg font-medium  mb-4">
                {editingUser === "new" ? "Add New User" : "Edit User"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium  mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={
                      editingUser !== "new"
                        ? users.find((u) => u.id === editingUser)?.name
                        : ""
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium  mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={
                      editingUser !== "new"
                        ? users.find((u) => u.id === editingUser)?.email
                        : ""
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2  bg-[#373636] rounded-md hover:bg-[#4d4c4c] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingUser === "new" ? "Add User" : "Update User"}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditingUser("new")}
              className="w-full mb-6 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              <span>Add New User</span>
            </button>
          )}

          {/* Users List */}
          <div>
            <h3 className="text-lg font-medium  mb-4">Users</h3>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium ">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        className="w-5 h-5"
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
                          type: "user",
                          id: user.id,
                          name: user.name,
                        })
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        className="w-5 h-5"
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
