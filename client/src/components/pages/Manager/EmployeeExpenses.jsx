import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileText,
  Calendar,
  IndianRupee,
  Tag,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronUp,
  ChevronDown,
  CreditCard,
} from "lucide-react";

export default function EmployeeExpenses() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { employeeId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalAmount: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "submission_date",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        const headers = { "x-auth-token": token };
        setIsLoggedIn(true);

        // Fetch expenses
        const { data } = await axios.get(
          `http://localhost:8080/api/manager/employee/${employeeId}`,
          { headers }
        );
        setExpenses(data);
        setFilteredExpenses(data);

        // Fetch employee details
        const { data: employeeData } = await axios.get(
          `http://localhost:8080/api/manager/employee-details/${employeeId}`,
          { headers }
        );
        setEmployeeDetails(employeeData);

        // Calculate stats
        const totalAmount = data.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const pendingCount = data.filter(
          (expense) => expense.status === "pending"
        ).length;
        const approvedCount = data.filter(
          (expense) => expense.status === "approved"
        ).length;
        const rejectedCount = data.filter(
          (expense) => expense.status === "rejected"
        ).length;

        setStats({
          totalExpenses: data.length,
          pendingCount,
          approvedCount,
          rejectedCount,
          totalAmount,
        });
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load employee expense data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId]);

  const updateExpenseStatus = async (expenseId, newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:8080/api/manager/updateStatus/${expenseId}`,
        { status: newStatus },
        { headers: { "x-auth-token": token } }
      );

      // Update expenses list
      const updatedExpenses = expenses.map((expense) =>
        expense._id === expenseId ? { ...expense, status: newStatus } : expense
      );
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);

      // Update stats
      const totalAmount = updatedExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const pendingCount = updatedExpenses.filter(
        (expense) => expense.status === "pending"
      ).length;
      const approvedCount = updatedExpenses.filter(
        (expense) => expense.status === "approved"
      ).length;
      const rejectedCount = updatedExpenses.filter(
        (expense) => expense.status === "rejected"
      ).length;

      setStats({
        totalExpenses: updatedExpenses.length,
        pendingCount,
        approvedCount,
        rejectedCount,
        totalAmount,
      });

      // Show success message
      toast.success(
        newStatus === "approved"
          ? "Expense approved successfully"
          : "Expense rejected successfully"
      );
    } catch (error) {
      console.error("Error updating expense status", error);
      toast.error("Error updating expense status");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (expenseId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Find the expense to get the amount
      const expense = expenses.find((exp) => exp._id === expenseId);
      if (!expense) {
        throw new Error("Expense not found");
      }

      // Ensure expense is approved and not already paid
      if (expense.status !== "approved") {
        toast.error("Expense must be approved to process payment");
        return;
      }
      if (expense.payment) {
        toast.error("Expense is already paid");
        return;
      }

      // Call backend to create a Razorpay order
      const { data: order } = await axios.post(
        `http://localhost:8080/api/manager/create-razorpay-order/${expenseId}`,
        { amount: expense.amount },
        { headers: { "x-auth-token": token } }
      );

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use environment variable
        amount: order.amount, // Amount in paise
        currency: "INR",
        name: "FinTrak",
        description: `Payment for expense: ${expense.vendor}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment and update payment status
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            // Call backend to verify payment and update payment field
            await axios.post(
              `http://localhost:8080/api/manager/verify-payment/${expenseId}`,
              paymentData,
              { headers: { "x-auth-token": token } }
            );

            // Update local state
            const updatedExpenses = expenses.map((exp) =>
              exp._id === expenseId ? { ...exp, payment: true } : exp
            );
            setExpenses(updatedExpenses);
            setFilteredExpenses(updatedExpenses);

            // Update stats
            const totalAmount = updatedExpenses.reduce(
              (sum, exp) => sum + exp.amount,
              0
            );
            const pendingCount = updatedExpenses.filter(
              (exp) => exp.status === "pending"
            ).length;
            const approvedCount = updatedExpenses.filter(
              (exp) => exp.status === "approved"
            ).length;
            const rejectedCount = updatedExpenses.filter(
              (exp) => exp.status === "rejected"
            ).length;

            setStats({
              totalExpenses: updatedExpenses.length,
              pendingCount,
              approvedCount,
              rejectedCount,
              totalAmount,
            });

            toast.success("Payment processed successfully");
          } catch (error) {
            console.error("Error verifying payment", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: employeeDetails
            ? `${employeeDetails.firstName} ${employeeDetails.lastName}`
            : "",
          email: employeeDetails ? employeeDetails.email : "",
        },
        theme: {
          color: "#2563EB",
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      console.error("Error processing payment", error);
      toast.error(error.message || "Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sort expenses
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort expenses
  useEffect(() => {
    let filtered = [...expenses];

    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          expense.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "submission_date") {
          return sortConfig.direction === "ascending"
            ? new Date(a.submission_date) - new Date(b.submission_date)
            : new Date(b.submission_date) - new Date(a.submission_date);
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
    }

    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const getPaymentStatusColor = (payment) => {
    return payment ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Employee Expenses
              </h1>
              {employeeDetails && (
                <p className="text-gray-600 mt-1">
                  {employeeDetails.firstName} {employeeDetails.lastName} (
                  {employeeDetails.email})
                </p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Total Expenses
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600">
                  {stats.totalExpenses}
                </span>
                <FileText className="h-8 w-8 ml-auto text-blue-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Pending
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-yellow-600">
                  {stats.pendingCount}
                </span>
                <Clock className="h-8 w-8 ml-auto text-yellow-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Approved
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-green-600">
                  {stats.approvedCount}
                </span>
                <CheckCircle className="h-8 w-8 ml-auto text-green-500 opacity-75" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Total Amount
              </h2>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600">
                  <IndianRupee className="h-6 w-6 inline-block mr-1" />
                  {stats.totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <IndianRupee className="h-8 w-8 ml-auto text-red-500 opacity-75" />
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Expense Claims
                </h2>
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="search"
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search expenses..."
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
                  {filteredExpenses.length > 0 ? (
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
                              onClick={() => requestSort("submission_date")}
                            >
                              <div className="flex items-center space-x-1">
                                <span>Date</span>
                                <SortIcon column="submission_date" />
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
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentItems.map((expense) => (
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
                                    {formatDate(expense.submission_date)}
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
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {expense.status === "pending" && (
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition flex items-center"
                                      onClick={() =>
                                        updateExpenseStatus(
                                          expense._id,
                                          "approved"
                                        )
                                      }
                                      disabled={loading}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </button>
                                    <button
                                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition flex items-center"
                                      onClick={() =>
                                        updateExpenseStatus(
                                          expense._id,
                                          "rejected"
                                        )
                                      }
                                      disabled={loading}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </button>
                                  </div>
                                )}
                                {expense.status === "approved" &&
                                  !expense.payment && (
                                    <div className="flex justify-end">
                                      <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition flex items-center"
                                        onClick={() =>
                                          handlePayment(expense._id)
                                        }
                                        disabled={loading}
                                      >
                                        <CreditCard className="h-4 w-4 mr-1" />
                                        Make Payment
                                      </button>
                                    </div>
                                  )}
                                {expense.status === "approved" &&
                                  expense.payment && (
                                    <div className="flex justify-end">
                                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                                        <CreditCard className="h-5 w-5 mr-1 text-blue-500" />
                                        Paid
                                      </span>
                                    </div>
                                  )}
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
                                {indexOfLastItem > filteredExpenses.length
                                  ? filteredExpenses.length
                                  : indexOfLastItem}
                              </span>{" "}
                              of{" "}
                              <span className="font-medium">
                                {filteredExpenses.length}
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
                        {searchTerm
                          ? "No expenses match your search criteria. Try a different search term."
                          : "This employee has not submitted any expenses yet."}
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
