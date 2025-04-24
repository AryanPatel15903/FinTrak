import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ category: '', limit: '' });

  const categories = [
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:8080/api/admin/policies', {
        headers: { 'x-auth-token': token },
      });
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching policies', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:8080/api/admin/policies/add', newPolicy, {
        headers: { 'x-auth-token': token },
      });
      toast.success('Policy added successfully');
      setPolicies((prev) => [...prev, data.policy]);
      setNewPolicy({ category: '', limit: '' });
    } catch (error) {
      console.error('Error adding policy', error);
      toast.error('Failed to add policy');
    }
  };

  const handleDeletePolicy = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/admin/policies/delete/${id}`, {
        headers: { 'x-auth-token': token },
      });
      toast.success('Policy deleted successfully');
      setPolicies((prev) => prev.filter((policy) => policy._id !== id));
    } catch (error) {
      console.error('Error deleting policy', error);
      toast.error('Failed to delete policy');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Policy Management</h2>
      <form onSubmit={handleAddPolicy} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newPolicy.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
            Limit
          </label>
          <input
            type="number"
            id="limit"
            name="limit"
            value={newPolicy.limit}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Policy
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6">Existing Policies</h3>
      <ul className="divide-y divide-gray-200">
        {policies.map((policy) => (
          <li key={policy._id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{policy.category}</p>
              <p className="text-sm text-gray-500">Limit: {policy.limit}</p>
            </div>
            <button
              onClick={() => handleDeletePolicy(policy._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}