import React, { useEffect, useState } from "react";
import axios from "axios";
import { IndianRupee } from "lucide-react";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard stats
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);

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

        setPendingCount(pendingResponse.data.count);
        setApprovedCount(approvedResponse.data.count);
        setRejectedCount(rejectedResponse.data.count);

        // Fetch all expenses data
        const expensesResponse = await axios.get(
          "http://localhost:8080/api/expenses/myexpenses",
          {
            headers: { "x-auth-token": token },
          }
        );

        setExpenses(expensesResponse.data);
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
    setCurrentPage(1);
  };

  // Apply filters to expenses
  const filteredExpenses = expenses.filter((expense) => {
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
  });

  // Get current expenses for pagination
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Expenses</h1>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Pending
              </h2>
              <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Approved
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {approvedCount}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Rejected
              </h2>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          Showing {filteredExpenses.length === 0 ? 0 : indexOfFirstExpense + 1}{" "}
          to {Math.min(indexOfLastExpense, filteredExpenses.length)} of{" "}
          {filteredExpenses.length} expenses
        </div>
      </div>

      {/* Expense Table */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-600">No expenses found</p>
          <p className="text-gray-500 mt-1">
            Try adjusting your filters or add new expenses
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentExpenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <IndianRupee className="h-4 w-4 inline-block mr-1" />
                      {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {expense.category_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {expense.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : expense.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {expense.status.charAt(0).toUpperCase() +
                          expense.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredExpenses.length > expensesPerPage && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } text-sm font-medium`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {[
              ...Array(
                Math.ceil(filteredExpenses.length / expensesPerPage)
              ).keys(),
            ].map(
              (number) =>
                number + 1 >= currentPage - 2 &&
                number + 1 <= currentPage + 2 && (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === number + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    {number + 1}
                  </button>
                )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredExpenses.length / expensesPerPage)
              }
              className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                currentPage ===
                Math.ceil(filteredExpenses.length / expensesPerPage)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } text-sm font-medium`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
