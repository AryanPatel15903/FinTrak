// ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8080/api/manager/employees', {
          headers: { 'x-auth-token': token },
        });
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleViewExpenses = (employeeId) => {
    navigate(`/manager/employee/${employeeId}/expenses`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Employees</h2>
      {employees.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <li key={employee._id} className="py-2 flex justify-between items-center">
              <div>
                {employee.firstName} {employee.lastName} - {employee.email}
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleViewExpenses(employee._id)}
              >
                View Expenses
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
}
