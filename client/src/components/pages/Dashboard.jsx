import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Mistral } from "@mistralai/mistralai";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CircleStackIcon, ClockIcon } from '@heroicons/react/24/outline';

const apiKey = "hiirJwgJlEBEXxj7SlGS7fAsr27wocwr";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalRemainingBudget, setTotalRemainingBudget] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [expensesTrend, setExpensesTrend] = useState([]);
  const [expensesByStatus, setExpensesByStatus] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [animationActive, setAnimationActive] = useState(true);
  const [recommendation, setRecommendation] = useState("");
  const [loadingRec, setLoadingRec] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Colors for charts
  const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
  ];
  
  const STATUS_COLORS = {
    pending: "#f59e0b", // amber-500
    approved: "#10b981", // emerald-500
    rejected: "#ef4444", // red-500
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        // Fetch user data
        const { data: user } = await axios.get(
          "http://localhost:8080/api/users/me",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserData(user);
        setIsLoggedIn(true);

        // Calculate total budget
        setTotalBudget(user.totalBudget);

        // Calculate total remaining budget
        const remaining = Object.values(user.budget || {}).reduce(
          (sum, amount) => sum + amount,
          0
        );
        setTotalRemainingBudget(remaining);

        // Fetch expense counts
        const { data: pendingData } = await axios.get(
          "http://localhost:8080/api/expenses/pendingcount",
          {
            headers: { "x-auth-token": token },
          }
        );
        setPendingCount(pendingData.count);

        const { data: approvedData } = await axios.get(
          "http://localhost:8080/api/expenses/approvedcount",
          {
            headers: { "x-auth-token": token },
          }
        );
        setApprovedCount(approvedData.count);

        const { data: rejectedData } = await axios.get(
          "http://localhost:8080/api/expenses/rejectedcount",
          {
            headers: { "x-auth-token": token },
          }
        );
        setRejectedCount(rejectedData.count);

        // Fetch recent expenses
        const { data: recent } = await axios.get(
          "http://localhost:8080/api/expenses/recent",
          {
            headers: { "x-auth-token": token },
          }
        );
        setRecentExpenses(recent);

        // Fetch expenses
        const { data: expenses } = await axios.get(
          "http://localhost:8080/api/expenses/myexpenses",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserExpenses(expenses);

        // Fetch expenses by category
        try {
          const { data: categoryData } = await axios.get(
            "http://localhost:8080/api/expenses/bycategory",
            {
              headers: { "x-auth-token": token },
            }
          );
          setExpensesByCategory(categoryData);
        } catch (err) {
          console.error("Failed to fetch expenses by category", err);
          // Mock data for expenses by category
          const mockCategories = Object.keys(user.budget || {}).map(
            (category) => ({
              name: category,
              value: Math.floor(Math.random() * 5000),
            })
          );
          setExpensesByCategory(mockCategories);
        }

        // Fetch expenses trend
        try {
          const { data: trendData } = await axios.get(
            "http://localhost:8080/api/expenses/trend",
            {
              headers: { "x-auth-token": token },
            }
          );
          setExpensesTrend(trendData);
        } catch (err) {
          console.error("Failed to fetch expense trends", err);
          // Mock data for expense trends
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
          const mockTrend = months.map((month) => ({
            name: month,
            amount: Math.floor(Math.random() * 10000),
          }));
          setExpensesTrend(mockTrend);
        }

        // Set expenses by status
        setExpensesByStatus([
          {
            name: "Pending",
            value: pendingData.count,
            color: STATUS_COLORS.pending,
          },
          {
            name: "Approved",
            value: approvedData.count,
            color: STATUS_COLORS.approved,
          },
          {
            name: "Rejected",
            value: rejectedData.count,
            color: STATUS_COLORS.rejected,
          },
        ]);

        // Mock data for top vendors
        try {
          const { data: vendorData } = await axios.get(
            "http://localhost:8080/api/expenses/topvendors",
            {
              headers: { "x-auth-token": token },
            }
          );
          setTopVendors(vendorData);
        } catch (err) {
          console.error("Failed to fetch top vendors", err);
          // Create mock data based on recent expenses
          const vendorMap = {};
          recent.forEach((expense) => {
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

          setTopVendors(
            mockVendors.length
              ? mockVendors
              : [
                  { name: "Uber", value: 1200 },
                  { name: "Amazon", value: 800 },
                  { name: "Office Supplies", value: 600 },
                  { name: "Travel Agency", value: 500 },
                  { name: "Restaurants", value: 400 },
                ]
          );
        }
      } catch (err) {
        console.error("Failed to fetch user data or expense counts", err);
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

  const handleGetRecommendation = async () => {
    setLoadingRec(true);
    setShowRecommendation(true);
    try {
      const rec = await generateBudgetRecommendation(
        totalRemainingBudget,
        userExpenses
      );
      setRecommendation(rec);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      setRecommendation("Failed to fetch recommendation. Try again.");
    } finally {
      setLoadingRec(false);
    }
  };

  const generateBudgetRecommendation = async (budget, expenses) => {
    const budgetText = JSON.stringify(budget);
    const historyText = JSON.stringify(expenses);
    
    const client = new Mistral({ apiKey });

    const chatResponse = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `You are a budget advisor. The user has a total remaining budget of ${budgetText}. Here is the user's past expense history: ${historyText}. 
          Based on the spending patterns:
          - Suggest how the user can allocate the remaining budget across different categories.
          - Give higher recommendations to categories where the user has spent less in the past.
          - Give lower recommendations to categories where the user has already spent a lot.
          - Give recommendation in such way that whole remaining budget utilize.
          Return the recommendation as a Table format with category names and recommended spending amounts. The total of all recommended amounts should not exceed the total remaining budget. Only return the Table, no extra text.`,
        },
      ],
    });

    return chatResponse.choices[0].message.content;
  };

  // Calculate budget usage percentage
  const budgetUsagePercent = totalBudget ? ((totalBudget - totalRemainingBudget) / totalBudget) * 100 : 0;

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
          {/* Header with greeting and summary */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 md:p-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Welcome back, {userData?.firstName}!
            </h1>
            <p className="text-blue-100 mb-6">Here's your financial snapshot for today.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Budget Summary Cards */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CircleStackIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Total Budget</h3>
                </div>
                <p className="text-2xl font-bold">${totalBudget?.toFixed(2)}</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Remaining Budget</h3>
                </div>
                <p className="text-2xl font-bold">${totalRemainingBudget?.toFixed(2)}</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Approved</h3>
                </div>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ArrowTrendingDownIcon className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Pending</h3>
                </div>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          {/* Budget Progress Bar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Budget Usage</h2>
              <span className="text-sm text-gray-500">{budgetUsagePercent.toFixed(1)}% Used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Expenses by Category (Pie Chart) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold">Expenses by Category</h2>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={animationActive}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 2: Expenses Trend (Line Chart) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold">Expenses Trend</h2>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={expensesTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        isAnimationActive={animationActive}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Top Vendors (Bar Chart) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold">Top Vendors</h2>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topVendors}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Bar
                        dataKey="value"
                        isAnimationActive={animationActive}
                        animationDuration={1500}
                        animationEasing="ease-out"
                        radius={[0, 4, 4, 0]}
                      >
                        {topVendors.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 4: Expenses by Status (Pie Chart) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold">Expenses by Status</h2>
              </div>
              <div className="p-6">
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
                        animationDuration={1500}
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
          </div>

          {/* AI Budget Recommendation Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Budget Recommendation</h2>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  loadingRec 
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={handleGetRecommendation}
                disabled={loadingRec}
              >
                {loadingRec ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Get Recommendation"
                )}
              </button>
            </div>
            {showRecommendation && (
              <div className="p-6">
                {loadingRec ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="text-center">
                      <div className="animate-pulse flex space-x-2 justify-center mb-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <p className="text-gray-500">Analyzing your expenses and generating smart recommendations...</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {recommendation}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Expenses - Re-enable if needed */}
          {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Recent Expenses</h2>
            </div>
            <div className="overflow-x-auto">
              {recentExpenses.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentExpenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.vendor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            expense.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : expense.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No recent expenses found. Create your first expense claim!
                </div>
              )}
            </div>
          </div> */}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">You're not logged in</h2>
            <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <i className="fa-solid fa-sign-in-alt mr-2"></i> Log In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}