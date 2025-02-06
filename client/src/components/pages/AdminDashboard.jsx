import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  // State for the form fields
  const [managerData, setManagerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Optionally, you can use state to store the list of managers.
  const [managers, setManagers] = useState([]);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission to add a new manager
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Backend endpoint for adding a manager (admin only)
      const url = "http://localhost:8080/api/admin/addManager";
      const { data: res } = await axios.post(url, managerData, {
        headers: { "x-auth-token": token },
      });
      setMessage(res.message || "Manager added successfully");
      // Optionally clear the form fields after success
      setManagerData({ firstName: "", lastName: "", email: "", password: "" });
      // Optionally, refresh the managers list after adding a new one
      fetchManagers();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add manager. Please try again.");
      }
    }
  };

  // Optional: Fetch the list of managers (if backend endpoint exists)
  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:8080/api/admin/managers", {
        headers: { "x-auth-token": token },
      });
      setManagers(data);
    } catch (err) {
      console.error("Error fetching managers", err);
    }
  };

  // Use useEffect to load managers on component mount if needed
  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Manager</h2>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div className="mb-4">
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div className="mb-4">
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div className="mb-4">
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          {error && <p className="mb-4 text-red-600">{error}</p>}
          {message && <p className="mb-4 text-green-600">{message}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Manager
          </button>
        </form>
      </section>

      {/* Optional: Display list of managers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Existing Managers</h2>
        {managers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {managers.map((manager) => (
              <li key={manager._id} className="py-2 flex justify-between items-center">
                <div>
                  {manager.firstName} {manager.lastName} - {manager.email}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No managers found.</p>
        )}
      </section>

    </div>
  );
}
