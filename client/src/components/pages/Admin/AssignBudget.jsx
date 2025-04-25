import React, { useState, useEffect } from "react";
import axios from "axios";
import { IndianRupee } from "lucide-react";

export default function AssignBudget() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:8080/api/admin/users",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
        showNotification("Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      5000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !totalBudget) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/admin/assign-budget/${selectedUser}`,
        { totalBudget: parseFloat(totalBudget) || 0 },
        { headers: { "x-auth-token": token } }
      );
      showNotification("Budget assigned successfully", "success");
      setTotalBudget("");
      setSelectedUser("");
    } catch (error) {
      console.error("Error assigning budget", error);
      showNotification("Failed to assign budget", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (e) => {
    // Remove non-numeric characters except decimal point
    let value = e.target.value.replace(/[^\d.]/g, "");
    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    setTotalBudget(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl mx-auto mt-10">
      {notification.show && (
        <div
          className={`mb-6 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assign Budget</h1>
        <p className="text-gray-600 mt-2">
          Allocate financial resources to team members
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700"
          >
            Team Member
          </label>
          <div className="relative">
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              disabled={loading || users.length === 0}
            >
              <option value="">Select a team member</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          {users.length === 0 && !loading && (
            <p className="text-sm text-red-600">No users available</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="totalBudget"
            className="block text-sm font-medium text-gray-700"
          >
            Total Budget Amount
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IndianRupee className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="totalBudget"
              value={totalBudget}
              onChange={formatCurrency}
              placeholder="0.00"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            disabled={loading || !selectedUser || !totalBudget}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Assign Budget"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
