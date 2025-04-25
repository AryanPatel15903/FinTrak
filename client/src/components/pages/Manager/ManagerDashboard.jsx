import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Users,
  FileText,
  IndianRupee,
  User,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function ManagerDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingExpenses: 0,
    totalExpensesAmount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const { data: user } = await axios.get(
          "http://localhost:8080/api/users/me",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserData(user);
        setIsLoggedIn(true);

        // Fetch employees
        const { data: employeesData } = await axios.get(
          "http://localhost:8080/api/manager/employees",
          { headers: { "x-auth-token": token } }
        );
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        setStats((prev) => ({ ...prev, totalEmployees: employeesData.length }));

        // Fetch pending expenses count
        const { data: pendingData } = await axios.get(
          "http://localhost:8080/api/manager/pending-expenses-count",
          { headers: { "x-auth-token": token } }
        );
        setStats((prev) => ({ ...prev, pendingExpenses: pendingData.count }));

        // Fetch total expenses amount
        const { data: totalData } = await axios.get(
          "http://localhost:8080/api/manager/total-expenses",
          { headers: { "x-auth-token": token } }
        );
        setStats((prev) => ({ ...prev, totalExpensesAmount: totalData.total }));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort employees
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
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter and sort employees
  useEffect(() => {
    let filtered = [...employees];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee._id &&
            employee._id
              .slice(-6)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "_id") {
          const aVal = a[sortConfig.key] ? a[sortConfig.key].slice(-6) : "";
          const bVal = b[sortConfig.key] ? b[sortConfig.key].slice(-6) : "";
          return sortConfig.direction === "ascending"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
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

    setFilteredEmployees(filtered);
  }, [employees, searchTerm, sortConfig]);

  const handleViewExpenses = (employeeId) => {
    navigate(`/manager/employee/${employeeId}/expenses`);
  };

  // Sort indicator component
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <div className="h-4 w-4 text-gray-400 flex items-center justify-center">
          <ChevronUp className="h-3 w-3" />
          <ChevronDown className="h-3 w-3 -mt-1" />
        </div>
      );
    }

    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const getStatusColor = (status) => {
  //   switch(status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-600';
  //     case 'inactive':
  //       return 'bg-red-100 text-red-600';
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-600';
  //     default:
  //       return 'bg-gray-100 text-gray-600';
  //   }
  // };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Manager Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {userData?.firstName || "Manager"}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Total Employees
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600">
                  {stats.totalEmployees}
                </span>
                <Users className="h-8 w-8 ml-auto text-blue-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Pending Expenses
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-yellow-600">
                  {stats.pendingExpenses}
                </span>
                <FileText className="h-8 w-8 ml-auto text-yellow-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Total Expenses Amount
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-green-600">
                  <IndianRupee className="h-6 w-6 inline-block mr-1" />
                  {stats.totalExpensesAmount.toLocaleString()}
                </span>
                <IndianRupee className="h-8 w-8 ml-auto text-green-500 opacity-75" />
              </div>
            </div>
          </div>

          {/* Employees List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Employees List
                </h2>
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search employees..."
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
                  {filteredEmployees.length > 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => requestSort("firstName")}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Name</span>
                                <SortIcon column="firstName" />
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => requestSort("email")}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Email</span>
                                <SortIcon column="email" />
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => requestSort("_id")}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Employee ID</span>
                                <SortIcon column="_id" />
                              </div>
                            </th>
                            {/* <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th> */}
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentItems.map((employee) => (
                            <tr key={employee._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                      {employee.firstName
                                        .charAt(0)
                                        .toUpperCase()}
                                      {employee.lastName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {employee.firstName} {employee.lastName}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {employee.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {employee._id
                                    ? employee._id.slice(-6)
                                    : "N/A"}
                                </div>
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    getStatusColor(employee.status || 'active')
                                  }`}
                                >
                                  {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1) || 'Active'}
                                </span>
                              </td> */}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    handleViewExpenses(employee._id)
                                  }
                                  className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition"
                                >
                                  View Expenses
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                              currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                              currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{" "}
                              <span className="font-medium">
                                {indexOfFirstItem + 1}
                              </span>{" "}
                              to{" "}
                              <span className="font-medium">
                                {indexOfLastItem > filteredEmployees.length
                                  ? filteredEmployees.length
                                  : indexOfLastItem}
                              </span>{" "}
                              of{" "}
                              <span className="font-medium">
                                {filteredEmployees.length}
                              </span>{" "}
                              results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                  currentPage === 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                <span className="sr-only">Previous</span>
                                &laquo;
                              </button>

                              {Array.from({ length: totalPages }).map(
                                (_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border ${
                                      currentPage === index + 1
                                        ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    } text-sm font-medium`}
                                  >
                                    {index + 1}
                                  </button>
                                )
                              )}

                              <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                  currentPage === totalPages
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                <span className="sr-only">Next</span>
                                &raquo;
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg py-12 text-center">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No employees found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm
                          ? "No employees match your search criteria. Try a different search term."
                          : "No employees are currently assigned to you."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )}
    </>
  );
}
