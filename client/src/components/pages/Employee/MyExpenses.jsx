import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IndianRupee,
  FileText,
  Calendar,
  Tag,
  ShoppingBag,
  Search,
  Clock,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalAmount: 0,
    totalCount: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    dateRange: {
      startDate: "",
      endDate: "",
    },
    minAmount: "",
    maxAmount: "",
  });

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Sort
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  // Toggle filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Categories (replace with your actual categories)
  const categories = [
    "Travel",
    "Meals",
    "Office Supplies",
    "Equipment",
    "Transportation",
    "Other",
  ];

  // Fetch counts from the API and expenses data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch the counts
        const pendingResponse = await axios.get(
          "http://localhost:8080/api/expenses/pendingcount",
          {
            headers: { "x-auth-token": token },
          }
        );
        const approvedResponse = await axios.get(
          "http://localhost:8080/api/expenses/approvedcount",
          {
            headers: { "x-auth-token": token },
          }
        );
        const rejectedResponse = await axios.get(
          "http://localhost:8080/api/expenses/rejectedcount",
          {
            headers: { "x-auth-token": token },
          }
        );

        // Fetch all expenses data
        const expensesResponse = await axios.get(
          "http://localhost:8080/api/expenses/myexpenses",
          {
            headers: { "x-auth-token": token },
          }
        );

        // Calculate total amount
        const totalAmount = expensesResponse.data.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        setExpenses(expensesResponse.data);
        setStats({
          pendingCount: pendingResponse.data.count,
          approvedCount: approvedResponse.data.count,
          rejectedCount: rejectedResponse.data.count,
          totalAmount: totalAmount,
          totalCount: expensesResponse.data.length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load expenses");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter handling
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      setFilters({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [name]: value,
        },
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }

    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      category: "",
      dateRange: {
        startDate: "",
        endDate: "",
      },
      minAmount: "",
      maxAmount: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sort handler
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply filters, search, and sort to expenses
  const processedExpenses = expenses.filter((expense) => {
    // Search functionality
    const searchFields = [
      expense.vendor.toLowerCase(),
      expense.category_id.toLowerCase(),
      expense.status.toLowerCase(),
    ];
    if (
      searchTerm &&
      !searchFields.some((field) => field.includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }

    // Filter by status
    if (filters.status && expense.status !== filters.status) {
      return false;
    }

    // Filter by category
    if (filters.category && expense.category_id !== filters.category) {
      return false;
    }

    // Filter by date range
    if (
      filters.dateRange.startDate &&
      new Date(expense.date) < new Date(filters.dateRange.startDate)
    ) {
      return false;
    }
    if (
      filters.dateRange.endDate &&
      new Date(expense.date) > new Date(filters.dateRange.endDate)
    ) {
      return false;
    }

    // Filter by amount range
    if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "ascending"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

    if (sortConfig.key === "amount") {
      return sortConfig.direction === "ascending"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Get current expenses for pagination
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = processedExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );
  const totalPages = Math.ceil(processedExpenses.length / expensesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status icon and color helpers
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-600";
    }
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Expenses</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Expenses
          </h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600">
              {stats.totalCount}
            </span>
            <FileText className="h-8 w-8 ml-auto text-blue-500 opacity-75" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Pending</h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-yellow-600">
              {stats.pendingCount}
            </span>
            <Clock className="h-8 w-8 ml-auto text-yellow-500 opacity-75" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Approved</h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-green-600">
              {stats.approvedCount}
            </span>
            <CheckCircle className="h-8 w-8 ml-auto text-green-500 opacity-75" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Rejected</h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-red-600">
              {stats.rejectedCount}
            </span>
            <XCircle className="h-8 w-8 ml-auto text-red-500 opacity-75" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Total Amount
          </h2>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-purple-600">
              <IndianRupee className="h-6 w-6 inline-block mr-1" />
              {stats.totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {/* <IndianRupee className="h-8 w-8 ml-auto text-purple-500 opacity-75" /> */}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
              Expense Claims
            </h2>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full md:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {/* Filters Section - Collapsible */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range - Start */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.dateRange.startDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date Range - End */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.dateRange.endDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Min Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="minAmount"
                      value={filters.minAmount}
                      onChange={handleFilterChange}
                      placeholder="0.00"
                      className="w-full pl-10 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Max Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="maxAmount"
                      value={filters.maxAmount}
                      onChange={handleFilterChange}
                      placeholder="0.00"
                      className="w-full pl-10 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Filters Button */}
              <div className="mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {processedExpenses.length > 0 ? (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("vendor")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Vendor</span>
                            <SortIcon column="vendor" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("category_id")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Category</span>
                            <SortIcon column="category_id" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("date")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                            <SortIcon column="date" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("amount")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Amount</span>
                            <SortIcon column="amount" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("status")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            <SortIcon column="status" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentExpenses.map((expense) => (
                        <tr key={expense._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                  <ShoppingBag className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {expense.vendor}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 text-gray-500 mr-2" />
                              <div className="text-sm text-gray-500">
                                {expense.category_id}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <div className="text-sm text-gray-500">
                                {formatDate(expense.date)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <IndianRupee className="h-4 w-4 text-gray-500 mr-1" />
                              <div className="text-sm font-medium text-blue-600">
                                {expense.amount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span
                                className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  expense.status
                                )}`}
                              >
                                {getStatusIcon(expense.status)}
                                <span className="ml-1">
                                  {expense.status.charAt(0).toUpperCase() +
                                    expense.status.slice(1)}
                                </span>
                              </span>
                            </div>
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
                            {indexOfFirstExpense + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {indexOfLastExpense > processedExpenses.length
                              ? processedExpenses.length
                              : indexOfLastExpense}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {processedExpenses.length}
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
                            <span className="sr-only">Previous</span>«
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
                            <span className="sr-only">Next</span>»
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No expenses found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || Object.values(filters).some((val) => val)
                      ? "No expenses match your search criteria. Try different filters."
                      : "You haven't submitted any expenses yet."}
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