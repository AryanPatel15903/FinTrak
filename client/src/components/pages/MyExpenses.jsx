import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses when the component loads
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

        // Make a request to fetch all expenses
        const response = await axios.get(
          "http://localhost:8080/api/expenses/myexpenses",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to load expenses");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">My Expenses</h1>

      {expenses.length === 0 ? (
        <p>No expenses submitted yet.</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
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
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {expense.category_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {expense.vendor}
                </td>
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
                    {expense.status.charAt(0).toUpperCase() +
                      expense.status.slice(1)}
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
