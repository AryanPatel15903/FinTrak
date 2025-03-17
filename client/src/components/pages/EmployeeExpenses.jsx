import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

export default function EmployeeExpenses() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { employeeId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // if (!token) {
        //   setIsLoggedIn(false);
        //   return;
        // }

        const headers = { "x-auth-token": token };
        // setIsLoggedIn(true);

        // Fetch expenses
        const { data } = await axios.get(
          `http://localhost:8080/api/manager/employee/${employeeId}`,
          { headers }
        );
        setExpenses(data);

        // Fetch employee details
        const { data: employeeData } = await axios.get(
          `http://localhost:8080/api/manager/employee-details/${employeeId}`,
          { headers }
        );
        setEmployeeDetails(employeeData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [employeeId]);

  const updateExpenseStatus = async (expenseId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:8080/api/manager/updateStatus/${expenseId}`,
        { status: newStatus },
        { headers: { "x-auth-token": token } }
      );
      setMessage(data.message);
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === expenseId ? data.expense : expense
        )
      );

      // Show success message and clear it after 3 seconds
      setMessage(
        newStatus === "approved"
          ? "Expense approved successfully"
          : "Expense rejected successfully"
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating expense status", error);
      setMessage("Error updating expense status");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Employee Expenses</h1>
            {employeeDetails && (
              <p className="text-gray-600 mt-1">
                {employeeDetails.firstName} {employeeDetails.lastName} -{" "}
                {employeeDetails.email}
              </p>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-blue-700">{message}</p>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Expense Claims</h2>
            {expenses.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <li
                    key={expense._id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <p className="text-lg font-semibold">
                          {expense.vendor}
                        </p>
                        <p className="text-sm text-gray-500">
                          {expense.category_id}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">
                          Submitted:{" "}
                          {new Date(
                            expense.submission_date
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          ${expense.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            expense.status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : expense.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {expense.status.charAt(0).toUpperCase() +
                            expense.status.slice(1)}
                        </span>
                        {expense.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                              onClick={() =>
                                updateExpenseStatus(expense._id, "approved")
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                              onClick={() =>
                                updateExpenseStatus(expense._id, "rejected")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No expenses found for this employee.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
