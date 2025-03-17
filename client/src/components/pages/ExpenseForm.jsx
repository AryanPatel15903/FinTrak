import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { ToastContainer, toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false); // Add state for OCR loading
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    vendor: '',
    notes: '',
    status: 'pending',
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFilePreview(fileURL);
      processOCR(selectedFile); // Call OCR processing function
    } else {
      setFilePreview(null);
    }
  };

  const processOCR = (file) => {
    setOcrLoading(true);
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      console.log(text);
      // Extract data from OCR text and update form fields
      // const extractedData = extractDataFromText(text);
      // setFormData((prev) => ({ ...prev, ...extractedData }));
      setOcrLoading(false);
    }).catch((error) => {
      console.error('Error processing OCR:', error);
      setOcrLoading(false);
    });
  };

  // const extractDataFromText = (text) => {
  //   // Implement logic to extract amount, date, category, vendor, and notes from OCR text
  //   // This is a simple example and may need to be adjusted based on the actual text format
  //   const amountMatch = text.match(/Total Amount:\s*\$?(\d+(\.\d{2})?)/i); // Adjusted regex to match "Total Amount"
  //   const dateMatch = text.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
  //   const vendorMatch = text.match(/Vendor:\s*(\w+)/i);
  //   const notesMatch = text.match(/Notes:\s*(.*)/i);

  //   return {
  //     amount: amountMatch ? amountMatch[1] : '',
  //     date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
  //     vendor: vendorMatch ? vendorMatch[1] : '',
  //     notes: notesMatch ? notesMatch[1] : '',
  //   };
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
// const formDataWithFile = new FormData();
// formDataWithFile.append('file', file);
// formDataWithFile.append('amount', formData.amount);
// formDataWithFile.append('date', formData.date);
// formDataWithFile.append('category_id', formData.category_id);
// formDataWithFile.append('vendor', formData.vendor);
// formDataWithFile.append('notes', formData.notes);
// formDataWithFile.append('status', formData.status);

      const response = await axios.post('http://localhost:8080/api/expenses/submit', formData, {
        headers: {
          'x-auth-token': token,
//           'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data.message);
      toast.success('Expense submitted successfully!', { // Show success notification
        position: 'top-right',
        icon: '✅'
      });
      // navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit expense', { // Show error notification
        position: 'top-right',
        icon: '❌'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Submit New Expense</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center h-full">
            {filePreview ? (
              <div className="relative w-full h-full">
                {file.type.startsWith('image/') ? (
                  <img src={filePreview} alt="Preview" className="max-h-full w-full object-contain" />
                ) : (
                  <embed src={filePreview} type={file.type} className="h-full w-full object-contain" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col justify-center items-center h-full w-full border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500">
                <span className="text-4xl">+</span>
                <span className="text-sm">Upload a new Expense</span>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {file && <span className="mt-2 text-sm text-gray-600">{file.name}</span>}
          </div>

          <div className="space-y-6">
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
          </div>
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
            disabled={loading || ocrLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : ocrLoading ? 'Processing OCR...' : 'Submit Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
