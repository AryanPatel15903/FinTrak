import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Set the formData with default status as 'pending' but don't display status in the form
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    vendor: '',
    notes: '',
    status: 'pending', // Set status as 'pending' by default
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage

      // Make a POST request to submit the form data, with status defaulting to 'pending'
      const response = await axios.post('http://localhost:8080/api/expenses/submit', formData, {
        headers: {
          'x-auth-token': token, // Pass JWT token in the headers
        },
      });

      // Handle success response
      console.log(response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit New Expense</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="travel">Travel</option>
              <option value="meals">Meals</option>
              <option value="office">Office Supplies</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <input
              type="text"
              id="vendor"
              name="vendor"
              required
              value={formData.vendor}
              onChange={handleChange}
              className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
