import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  // const [remainingBudget, setRemainingBudget] = useState({});
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalRemainingBudget, setTotalRemainingBudget] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [expensesTrend, setExpensesTrend] = useState([]);
  const [expensesByStatus, setExpensesByStatus] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [animationActive, setAnimationActive] = useState(true);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const STATUS_COLORS = {
    pending: '#FFBB28',
    approved: '#00C49F',
    rejected: '#FF8042'
  };

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
        // setRemainingBudget(user.budget || {});
        setIsLoggedIn(true);

        // Calculate total budget
        setTotalBudget(user.totalBudget);

        // Calculate total remaining budget
        const remaining = Object.values(user.budget || {}).reduce((sum, amount) => sum + amount, 0);
        setTotalRemainingBudget(remaining);

        // Fetch expense counts
        const { data: pendingData } = await axios.get('http://localhost:8080/api/expenses/pendingcount', {
          headers: { 'x-auth-token': token },
        });
        setPendingCount(pendingData.count);

        const { data: approvedData } = await axios.get('http://localhost:8080/api/expenses/approvedcount', {
          headers: { 'x-auth-token': token },
        });
        setApprovedCount(approvedData.count);

        const { data: rejectedData } = await axios.get('http://localhost:8080/api/expenses/rejectedcount', {
          headers: { 'x-auth-token': token },
        });
        setRejectedCount(rejectedData.count);

        // Fetch recent expenses
        const { data: recent } = await axios.get('http://localhost:8080/api/expenses/recent', {
          headers: { 'x-auth-token': token },
        });
        setRecentExpenses(recent);

        // Fetch expenses by category (new endpoint needed)
        try {
          const { data: categoryData } = await axios.get('http://localhost:8080/api/expenses/bycategory', {
            headers: { 'x-auth-token': token },
          });
          setExpensesByCategory(categoryData);
        } catch (err) {
          console.error('Failed to fetch expenses by category', err);
          // Mock data for expenses by category
          const mockCategories = Object.keys(user.budget || {}).map(category => ({
            name: category,
            value: Math.floor(Math.random() * 5000)
          }));
          setExpensesByCategory(mockCategories);
        }

        // Fetch expenses trend (new endpoint needed)
        try {
          const { data: trendData } = await axios.get('http://localhost:8080/api/expenses/trend', {
            headers: { 'x-auth-token': token },
          });
          setExpensesTrend(trendData);
        } catch (err) {
          console.error('Failed to fetch expense trends', err);
          // Mock data for expense trends
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          const mockTrend = months.map(month => ({
            name: month,
            amount: Math.floor(Math.random() * 10000)
          }));
          setExpensesTrend(mockTrend);
        }

        // Set expenses by status
        setExpensesByStatus([
          { name: 'Pending', value: pendingData.count, color: STATUS_COLORS.pending },
          { name: 'Approved', value: approvedData.count, color: STATUS_COLORS.approved },
          { name: 'Rejected', value: rejectedData.count, color: STATUS_COLORS.rejected }
        ]);

        // Mock data for top vendors
        try {
          const { data: vendorData } = await axios.get('http://localhost:8080/api/expenses/topvendors', {
            headers: { 'x-auth-token': token },
          });
          setTopVendors(vendorData);
        } catch (err) {
          console.error('Failed to fetch top vendors', err);
          // Create mock data based on recent expenses
          const vendorMap = {};
          recent.forEach(expense => {
            if (vendorMap[expense.vendor]) {
              vendorMap[expense.vendor] += expense.amount;
            } else {
              vendorMap[expense.vendor] = expense.amount;
            }
          });
          
          const mockVendors = Object.entries(vendorMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
          
          setTopVendors(mockVendors.length ? mockVendors : [
            { name: 'Uber', value: 1200 },
            { name: 'Amazon', value: 800 },
            { name: 'Office Supplies', value: 600 },
            { name: 'Travel Agency', value: 500 },
            { name: 'Restaurants', value: 400 }
          ]);
        }

      } catch (err) {
        console.error('Failed to fetch user data or expense counts', err);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();

    // Add animation toggle
    const animationTimer = setTimeout(() => {
      setAnimationActive(false);
    }, 2500);

    return () => clearTimeout(animationTimer);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {userData?.firstName}</h1>
          </div>

          {/* Total Budget and Total Remaining Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Total Budget</h2>
              <p className="text-3xl font-bold text-green-600">${totalBudget?.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Total Remaining Budget</h2>
              <p className="text-3xl font-bold text-blue-600">${totalRemainingBudget?.toFixed(2)}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Expenses by Category (Pie Chart) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={animationActive}
                      animationDuration={2000}
                      animationEasing="ease-out"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Expenses Trend (Line Chart) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Expenses Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={expensesTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      strokeWidth={2}
                      isAnimationActive={animationActive}
                      animationDuration={2000}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Top Vendors (Bar Chart) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Top Vendors</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topVendors}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#82ca9d"
                      isAnimationActive={animationActive}
                      animationDuration={2000}
                      animationEasing="ease-out"
                    >
                      {topVendors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Expenses by Status (Area Chart) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Expenses by Status</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive={animationActive}
                      animationDuration={2000}
                      animationEasing="ease-out"
                    >
                      {expensesByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Remaining Budget by Category */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Remaining Budget by Category</h2>
            <ul className="divide-y divide-gray-200">
              {Object.entries(remainingBudget).map(([category, amount]) => (
                <li key={category} className="py-2 flex justify-between">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="text-blue-600 font-semibold">${amount?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div> */}

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
                            {new Date(expense.date).toLocaleDateString()}
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