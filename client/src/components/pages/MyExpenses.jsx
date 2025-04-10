import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // Fetch counts from the API and expenses data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch the counts
        const pendingResponse = await axios.get("http://localhost:8080/api/expenses/pendingcount", {
          headers: { "x-auth-token": token },
        });
        const approvedResponse = await axios.get("http://localhost:8080/api/expenses/approvedcount", {
          headers: { "x-auth-token": token },
        });
        const rejectedResponse = await axios.get("http://localhost:8080/api/expenses/rejectedcount", {
          headers: { "x-auth-token": token },
        });

        setPendingCount(pendingResponse.data.count);
        setApprovedCount(approvedResponse.data.count);
        setRejectedCount(rejectedResponse.data.count);

        // Fetch all expenses data
        const expensesResponse = await axios.get("http://localhost:8080/api/expenses/myexpenses", {
          headers: { "x-auth-token": token },
        });

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

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">My Expenses</h1>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Expenses</h2>
          <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Approved Expenses</h2>
          <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Rejected Expenses</h2>
          <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Expense Table */}
      {expenses.length === 0 ? (
        <p>No expenses submitted yet.</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{expense.category_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{expense.vendor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      expense.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : expense.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
