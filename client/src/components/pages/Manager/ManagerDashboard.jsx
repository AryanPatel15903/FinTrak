import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingExpenses: 0,
    totalExpensesAmount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        // const headers = { 'x-auth-token': token };

        const { data: user } = await axios.get(
          "http://localhost:8080/api/users/me",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserData(user);
        setIsLoggedIn(true);

        // Fetch employees
        const { data: employeesData } = await axios.get(
          "http://localhost:8080/api/manager/employees",
          // { headers }
          { headers: { "x-auth-token": token } }
        );
        setEmployees(employeesData);
        setStats((prev) => ({ ...prev, totalEmployees: employeesData.length }));

        // Fetch pending expenses count
        const { data: pendingData } = await axios.get(
          "http://localhost:8080/api/manager/pending-expenses-count",
          // { headers }
          { headers: { "x-auth-token": token } }
        );
        setStats((prev) => ({ ...prev, pendingExpenses: pendingData.count }));

        // Fetch total expenses amount
        const { data: totalData } = await axios.get(
          "http://localhost:8080/api/manager/total-expenses",
          // { headers }
          { headers: { "x-auth-token": token } }
        );
        setStats((prev) => ({ ...prev, totalExpensesAmount: totalData.total }));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const handleViewExpenses = (employeeId) => {
    navigate(`/manager/employee/${employeeId}/expenses`);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Welcome {userData?.firstName} to Manager Dashboard
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total Employees</h2>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalEmployees}
              </p>
            </div>

            {/* <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Expenses</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingExpenses}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Expenses Amount</h2>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalExpensesAmount.toLocaleString()}
          </p>
        </div> */}
          </div>

          {/* Employees List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Employees List</h2>
              {employees.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <li
                      key={employee._id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <p className="text-lg font-semibold">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {employee.email}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">
                            Employee ID: {employee._id.slice(-6)}
                          </p>
                        </div>
                        {/* <div className="flex-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          employee.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1) || 'Active'}
                      </span>
                    </div> */}
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                          onClick={() => handleViewExpenses(employee._id)}
                        >
                          View Expenses
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No employees found.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // navigate("/home")
        console.log("exit")
        
      )}
    </>
  );
}
