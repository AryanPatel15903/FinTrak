import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IndianRupee } from "lucide-react";

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ category: "", limit: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "category",
    direction: "ascending",
  });
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    averageLimit: 0,
    categories: 0,
  });

  const categories = [
    { value: "travel", label: "Travel" },
    { value: "meals", label: "Meals" },
    { value: "office", label: "Office Supplies" },
    { value: "training", label: "Training" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:8080/api/admin/policies",
        {
          headers: { "x-auth-token": token },
        }
      );
      setPolicies(data);
      setFilteredPolicies(data);
      updateStats(data);
    } catch (error) {
      console.error("Error fetching policies", error);
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (policyData) => {
    const uniqueCategories = new Set(
      policyData.map((policy) => policy.category)
    ).size;
    const totalLimit = policyData.reduce(
      (sum, policy) => sum + (parseInt(policy.limit) || 0),
      0
    );
    const avgLimit = policyData.length
      ? Math.round(totalLimit / policyData.length)
      : 0;

    setStats({
      totalPolicies: policyData.length,
      averageLimit: avgLimit,
      categories: uniqueCategories,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:8080/api/admin/policies/add",
        newPolicy,
        {
          headers: { "x-auth-token": token },
        }
      );
      toast.success("Policy added successfully");
      const updatedPolicies = [...policies, data.policy];
      setPolicies(updatedPolicies);
      setFilteredPolicies(updatedPolicies);
      updateStats(updatedPolicies);
      setNewPolicy({ category: "", limit: "" });
    } catch (error) {
      console.error("Error adding policy", error);
      toast.error("Failed to add policy");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPolicy = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/admin/policies/update/${editingPolicy._id}`,
        editingPolicy,
        { headers: { "x-auth-token": token } }
      );
      toast.success("Policy updated successfully");

      const updatedPolicies = policies.map((policy) =>
        policy._id === editingPolicy._id ? editingPolicy : policy
      );

      setPolicies(updatedPolicies);
      setFilteredPolicies(updatedPolicies);
      updateStats(updatedPolicies);
      setEditingPolicy(null);
    } catch (error) {
      console.error("Error updating policy", error);
      toast.error("Failed to update policy");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePolicy = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this policy?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/admin/policies/delete/${id}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      toast.success("Policy deleted successfully");
      const updatedPolicies = policies.filter((policy) => policy._id !== id);
      setPolicies(updatedPolicies);
      setFilteredPolicies(updatedPolicies);
      updateStats(updatedPolicies);
    } catch (error) {
      console.error("Error deleting policy", error);
      toast.error("Failed to delete policy");
    }
  };

  // Sort policies
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter and sort policies
  useEffect(() => {
    let filtered = [...policies];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((policy) =>
        policy.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle numerical sorting for limit
        if (sortConfig.key === "limit") {
          const aVal = parseInt(a[sortConfig.key]) || 0;
          const bVal = parseInt(b[sortConfig.key]) || 0;
          return sortConfig.direction === "ascending"
            ? aVal - bVal
            : bVal - aVal;
        }

        // Default string sorting
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPolicies(filtered);
  }, [policies, searchTerm, sortConfig]);

  // Sort indicator component
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    return sortConfig.direction === "ascending" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Policy Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage expense policies for your organization
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Policies
          </h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600">
              {stats.totalPolicies}
            </span>
            <svg
              className="h-8 w-8 ml-auto text-blue-500 opacity-75"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Average Limit
          </h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-green-600">
              <IndianRupee className="h-6 w-6 inline-block mr-1" />
              {stats.averageLimit}
            </span>
            <svg
              className="h-8 w-8 ml-auto text-green-500 opacity-75"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Categories</h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-purple-600">
              {stats.categories}
            </span>
            <svg
              className="h-8 w-8 ml-auto text-purple-500 opacity-75"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Add/Edit Policy Form */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
            {editingPolicy ? "Edit Policy" : "Create New Policy"}
          </h2>
          <form
            onSubmit={editingPolicy ? handleEditPolicy : handleAddPolicy}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={
                    editingPolicy ? editingPolicy.category : newPolicy.category
                  }
                  onChange={(e) => {
                    if (editingPolicy) {
                      setEditingPolicy({
                        ...editingPolicy,
                        category: e.target.value,
                      });
                    } else {
                      handleChange(e);
                    }
                  }}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={submitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="limit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expense Limit (₹)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="limit"
                    name="limit"
                    value={
                      editingPolicy ? editingPolicy.limit : newPolicy.limit
                    }
                    onChange={(e) => {
                      if (editingPolicy) {
                        setEditingPolicy({
                          ...editingPolicy,
                          limit: e.target.value,
                        });
                      } else {
                        handleChange(e);
                      }
                    }}
                    required
                    min="0"
                    className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4">
              {editingPolicy && (
                <button
                  type="button"
                  onClick={() => setEditingPolicy(null)}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
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
                ) : editingPolicy ? (
                  "Update Policy"
                ) : (
                  "Add Policy"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Policy Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Policy List</h2>
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredPolicies.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("category")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Category</span>
                          <SortIcon column="category" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("limit")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Limit</span>
                          <SortIcon column="limit" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPolicies.map((policy) => (
                      <tr key={policy._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center 
                                ${
                                  policy.category === "travel"
                                    ? "bg-blue-100 text-blue-600"
                                    : policy.category === "meals"
                                    ? "bg-green-100 text-green-600"
                                    : policy.category === "office"
                                    ? "bg-purple-100 text-purple-600"
                                    : policy.category === "training"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {policy.category.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {policy.category.charAt(0).toUpperCase() +
                                  policy.category.slice(1)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 text-gray-500 mr-1" />
                            <div className="text-sm text-gray-900">
                              {policy.limit}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingPolicy(policy)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePolicy(policy._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-gray-50 rounded-lg py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No policies found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first policy using the form
                    above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
