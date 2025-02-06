// EmployeeExpenses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EmployeeExpenses() {
  const { employeeId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log(employeeId)
        const { data } = await axios.get(`http://localhost:8080/api/manager/employee/${employeeId}`, {
          headers: { 'x-auth-token': token },
        });
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching employee expenses", error);
      }
    };
    fetchExpenses();
  }, [employeeId]);

  const updateExpenseStatus = async (expenseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:8080/api/manager/updateStatus/${expenseId}`,
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      setMessage(data.message);
      // Refresh the expense list by updating the specific expense
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === expenseId ? data.expense : expense
        )
      );
    } catch (error) {
      console.error("Error updating expense status", error);
      setMessage("Error updating expense status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Expenses</h1>
      {message && <p className="mb-4">{message}</p>}
      {expenses.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense._id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{expense.vendor}</p>
                <p className="text-sm text-gray-500">{expense.category_id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(expense.submission_date).toLocaleDateString()}
                </p>
                <p className="text-blue-600">${expense.amount.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    expense.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : expense.status === 'approved'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                </span>
                {expense.status === 'pending' && (
                  <>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => updateExpenseStatus(expense._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => updateExpenseStatus(expense._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found for this employee.</p>
      )}
    </div>
  );
}
