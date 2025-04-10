import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignBudget() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  // const [budget, setBudget] = useState({ travel: '', meals: '', office: '', training: '', other: '' });
  const [totalBudget, setTotalBudget] = useState(0); // State for total budget

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8080/api/admin/users', {
          headers: { 'x-auth-token': token },
        });
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  // Calculate total budget whenever the budget changes
  // useEffect(() => {
  //   const total = Object.values(budget).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  //   setTotalBudget(total);
  // }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/admin/assign-budget/${selectedUser}`,
        { totalBudget },
        { headers: { 'x-auth-token': token } }
      );
      alert('Budget assigned successfully');
    } catch (error) {
      console.error('Error assigning budget', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Budget</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700">
            Select User
          </label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        {/*{['travel', 'meals', 'office', 'training', 'other'].map((category) => (
          <div key={category}>
            <label htmlFor={category} className="block text-sm font-medium text-gray-700">
              {category.charAt(0).toUpperCase() + category.slice(1)} Budget
            </label>
            <input
              type="number"
              id={category}
              value={budget[category]}
              onChange={(e) => setBudget({ ...budget, [category]: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        ))}*/}

        {/* Total Budget Field */}
        <div>
          <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700">
            Total Budget
          </label>
          <input
            type="text"
            min="0"
            id="totalBudget"
            value={totalBudget}
            onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign Budget
        </button>
      </form>
    </div>
  );
}