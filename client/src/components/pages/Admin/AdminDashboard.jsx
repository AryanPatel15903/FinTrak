import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Bell,
  Settings,
  User,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api/admin"; // Adjust to your backend URL
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const STATUS_COLORS = {
  Approved: "#10b981",
  Pending: "#f59e0b",
  Rejected: "#ef4444",
};

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    unassignedEmployees: 0,
    activePolicies: 0,
    policyCompliance: 0,
  });
  const [employeeData, setEmployeeData] = useState([]);
  const [budgetUtilizationData, setBudgetUtilizationData] = useState([]);
  const [policyComplianceData, setPolicyComplianceData] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [animationActive, setAnimationActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        setLoading(true);
        const headers = { "x-auth-token": token };

        // Fetch Stats Overview
        const { data: statsData } = await axios.get(`${API_BASE_URL}/stats-overview`, {
          headers,
        });
        setStats(statsData);

        // Fetch Employee Assignment Trend
        const { data: empData } = await axios.get(`${API_BASE_URL}/employee-assignment-trend`, {
          headers,
        });
        setEmployeeData(empData);

        // Fetch Budget Utilization
        const { data: budgetData } = await axios.get(`${API_BASE_URL}/budget-utilization`, {
          headers,
        });
        setBudgetUtilizationData(budgetData);

        // Fetch Policy Compliance
        const { data: complianceData } = await axios.get(`${API_BASE_URL}/policy-compliance`, {
          headers,
        });
        setPolicyComplianceData(complianceData);

        // Fetch Policy Categories
        const { data: policyCatData } = await axios.get(`${API_BASE_URL}/policy-categories`, {
          headers,
        });
        setPolicyTypes(policyCatData);

        // Fetch User Activity
        const { data: activityData } = await axios.get(`${API_BASE_URL}/user-activity`, {
          headers,
        });
        setActivityData(activityData);

        // Fetch Recent Activities
        const { data: recentData } = await axios.get(`${API_BASE_URL}/recent-activities`, {
          headers,
        });
        setRecentActivities(recentData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError(err.message);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    fetchData();

    // Add animation toggle
    const animationTimer = setTimeout(() => {
      setAnimationActive(false);
    }, 2500);

    return () => clearTimeout(animationTimer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Employees</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.totalEmployees}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users size={22} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Unassigned Employees</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.unassignedEmployees}</h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <User size={22} className="text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Active Policies</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.activePolicies}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText size={22} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Policy Compliance</p>
                  <h3 className="text-3xl font-bold mt-1">{stats.policyCompliance}%</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Settings size={22} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Employee Assignment Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={employeeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="assigned"
                      stroke={COLORS[0]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={animationActive}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="unassigned"
                      stroke={COLORS[3]}
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

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Budget Utilization</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetUtilizationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                    <Bar
                      dataKey="utilized"
                      name="Utilized (%)"
                      isAnimationActive={animationActive}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      radius={[4, 4, 0, 0]}
                    >
                      {budgetUtilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Policy Compliance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={policyComplianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      isAnimationActive={animationActive}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {policyComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {policyComplianceData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {entry.name}: {entry.value.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Policy Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={policyTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      isAnimationActive={animationActive}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {policyTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">User Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="submissions"
                      stroke={COLORS[0]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={animationActive}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="approvals"
                      stroke={COLORS[1]}
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

          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Recent Activities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivities.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            {activity.user.initials}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {activity.user.firstName} {activity.user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{activity.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activity.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="px-6 py-4 border-t border-gray-200">
              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                View all activities
              </button>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}