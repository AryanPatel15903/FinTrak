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
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [stats, setStats] = useState({
    totalManagers: 0,
    activeManagers: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch managers from API
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:8080/api/admin/managers", {
        headers: { "x-auth-token": token },
      });
      setManagers(data);
      setFilteredManagers(data);
      setStats(prev => ({
        ...prev,
        totalManagers: data.length,
        activeManagers: data.filter(m => m.status === 'active').length
      }));
    } catch (err) {
      console.error("Error fetching managers", err);
    } finally {
      setLoading(false);
    }
  };

  // Sort managers
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter and sort managers based on search term and sort config
  useEffect(() => {
    let filtered = [...managers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(manager => 
        manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredManagers(filtered);
  }, [managers, searchTerm, sortConfig]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentManagers = filteredManagers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);

  // Initialize data
  useEffect(() => {
    fetchManagers();
  }, []);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Sort indicator component
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'ascending' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Total Managers</h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600">{stats.totalManagers}</span>
            <svg className="h-8 w-8 ml-auto text-blue-500 opacity-75" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Add Manager Form */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add New Manager</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={managerData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={managerData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={managerData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={managerData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Manager'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Managers Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Existing Managers</h2>
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="search"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search managers..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {loading && managers.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {managers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('firstName')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>First Name</span>
                            <SortIcon column="firstName" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('lastName')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Last Name</span>
                            <SortIcon column="lastName" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('email')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Email</span>
                            <SortIcon column="email" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentManagers.map((manager) => (
                        <tr key={manager._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{manager.firstName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{manager.lastName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{manager.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No managers found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first manager using the form above.</p>
                </div>
              )}

              {/* Pagination */}
              {filteredManagers.length > 0 && (
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div className="flex-1 flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredManagers.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredManagers.length}</span> results
                    </p>
                    <div className="flex">
                      {/* <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="mr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[5, 10, 20, 50].map(size => (
                          <option key={size} value={size}>
                            {size} per page
                          </option>
                        ))}
                      </select> */}
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          // Logic to show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}