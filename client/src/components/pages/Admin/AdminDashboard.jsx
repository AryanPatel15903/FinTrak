import React, { useState } from 'react';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Bell, Settings, User, Users, FileText, Calendar, ArrowUpRight, ArrowDownRight, Menu, X, Search } from 'lucide-react';

// Sample data for charts
const employeeData = [
  { name: 'Jan', assigned: 45, unassigned: 12 },
  { name: 'Feb', assigned: 50, unassigned: 10 },
  { name: 'Mar', assigned: 35, unassigned: 15 },
  { name: 'Apr', assigned: 70, unassigned: 5 },
  { name: 'May', assigned: 65, unassigned: 8 },
  { name: 'Jun', assigned: 80, unassigned: 3 }
];

const policyComplianceData = [
  { name: 'Compliant', value: 78, color: '#4ade80' },
  { name: 'Non-compliant', value: 22, color: '#f87171' }
];

const departmentData = [
  { name: 'Engineering', employees: 120 },
  { name: 'Marketing', employees: 60 },
  { name: 'Sales', employees: 80 },
  { name: 'HR', employees: 25 },
  { name: 'Finance', employees: 30 }
];

const activityData = [
  { name: 'Mon', logins: 145, changes: 24 },
  { name: 'Tue', logins: 132, changes: 18 },
  { name: 'Wed', logins: 164, changes: 32 },
  { name: 'Thu', logins: 170, changes: 28 },
  { name: 'Fri', logins: 149, changes: 22 }
];

const policyTypes = [
  { name: 'Security', value: 35, color: '#60a5fa' },
  { name: 'HR', value: 25, color: '#a78bfa' },
  { name: 'IT', value: 20, color: '#34d399' },
  { name: 'Compliance', value: 20, color: '#fbbf24' }
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            {/* <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                AD
              </div>
            </div> */}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Employees</p>
                  <h3 className="text-3xl font-bold mt-1">315</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users size={22} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+5.2%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Unassigned Employees</p>
                  <h3 className="text-3xl font-bold mt-1">12</h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <User size={22} className="text-red-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowDownRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 font-medium">-3.1%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Active Policies</p>
                  <h3 className="text-3xl font-bold mt-1">42</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText size={22} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+2.4%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Policy Compliance</p>
                  <h3 className="text-3xl font-bold mt-1">78%</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Settings size={22} className="text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+1.8%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Employee Assignment Trend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Employee Assignment Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={employeeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="assigned" stroke="#4f46e5" strokeWidth={2} />
                  <Line type="monotone" dataKey="unassigned" stroke="#f87171" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Department Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Department Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="employees" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Policy Compliance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Policy Compliance</h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={policyComplianceData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60}
                      outerRadius={90} 
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {policyComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Compliant: 78%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Non-compliant: 22%</span>
                </div>
              </div>
            </div>

            {/* Policy Types */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Policy Categories</h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={policyTypes} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={90} 
                      fill="#8884d8"
                      dataKey="value"
                      label
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

            {/* User Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">User Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="logins" stroke="#4f46e5" strokeWidth={2} />
                  <Line type="monotone" dataKey="changes" stroke="#34d399" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Recent Activities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">JD</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">John Doe</div>
                          <div className="text-sm text-gray-500">john@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Updated</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Employee Assignment</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 minutes ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">AS</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Alice Smith</div>
                          <div className="text-sm text-gray-500">alice@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Created</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New Policy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 minutes ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-white">RJ</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                          <div className="text-sm text-gray-500">robert@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Assigned</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manager Role</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white">EW</div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Emma Wilson</div>
                          <div className="text-sm text-gray-500">emma@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Deleted</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Outdated Policy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View all activities</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}