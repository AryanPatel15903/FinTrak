import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignManager() {
  const [managerData, setManagerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [managers, setManagers] = useState([]);
  const [stats, setStats] = useState({
    totalManagers: 0,
    activeManagers: 0,
    pendingApprovals: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:8080/api/admin/addManager";
      const { data: res } = await axios.post(url, managerData, {
        headers: { "x-auth-token": token },
      });
      setMessage(res.message || "Manager added successfully");
      setManagerData({ firstName: "", lastName: "", email: "", password: "" });
      fetchManagers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add manager. Please try again.");
    }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:8080/api/admin/managers", {
        headers: { "x-auth-token": token },
      });
      setManagers(data);
      setStats(prev => ({
        ...prev,
        totalManagers: data.length,
        activeManagers: data.filter(m => m.status === 'active').length
      }));
    } catch (err) {
      console.error("Error fetching managers", err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Managers</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalManagers}</p>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Managers</h2>
          <p className="text-3xl font-bold text-green-600">{stats.activeManagers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Approvals</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
        </div> */}
      </div>

      {/* Add Manager Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Manager</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={managerData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={managerData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={managerData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={managerData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            {message && <p className="text-green-600">{message}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Manager
            </button>
          </form>
        </div>
      </div>

      {/* Managers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Managers</h2>
          {managers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {managers.map((manager) => (
                <li key={manager._id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {manager.firstName} {manager.lastName}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{manager.email}</p>
                    </div>
                    {/* <div className="flex-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          manager.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {manager.status?.charAt(0).toUpperCase() + manager.status?.slice(1)}
                      </span>
                    </div> */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No managers found. Add your first manager!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}