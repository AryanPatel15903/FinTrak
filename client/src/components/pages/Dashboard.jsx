import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        // Fetch user data
        const { data: user } = await axios.get('http://localhost:8080/api/users/me', {
          headers: { 'x-auth-token': token },
        });
        setUserData(user);
        setIsLoggedIn(true);

        // Fetch pending expenses count
        const { data: pendingData } = await axios.get('http://localhost:8080/api/expenses/pendingcount', {
          headers: { 'x-auth-token': token },
        });
        setPendingCount(pendingData.count);

        // Fetch approved expenses count
        const { data: approvedData } = await axios.get('http://localhost:8080/api/expenses/approvedcount', {
          headers: { 'x-auth-token': token },
        });
        setApprovedCount(approvedData.count);

        // Fetch rejected expenses count
        const { data: rejectedData } = await axios.get('http://localhost:8080/api/expenses/rejectedcount', {
          headers: { 'x-auth-token': token },
        });
        setRejectedCount(rejectedData.count);

        // Fetch recent expenses (last 5 expenses)
        const { data: recent } = await axios.get('http://localhost:8080/api/expenses/recent', {
          headers: { 'x-auth-token': token },
        });
        setRecentExpenses(recent);

      } catch (err) {
        console.error('Failed to fetch user data or expense counts', err);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {userData?.firstName}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
              {recentExpenses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentExpenses.map((expense) => (
                    <li key={expense._id} className="py-4 flex justify-between items-center">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <p className="text-lg font-semibold">{expense.vendor}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">{expense.category_id}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">
                            {new Date(expense.submission_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-600">${expense.amount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
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
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No recent expenses found. Create your first expense claim!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <li>
          <Link to="/login" className="nav-links">
            <i className="fa-solid fa-sign-in-alt"></i> Login
          </Link>
        </li>
      )}
    </>
  );
}
