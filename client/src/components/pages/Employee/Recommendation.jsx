import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mistral } from "@mistralai/mistralai";
import { Link } from "react-router-dom";

const apiKey = "hiirJwgJlEBEXxj7SlGS7fAsr27wocwr";

export default function Recommendation() {
  const [recommendation, setRecommendation] = useState("");
  const [loadingRec, setLoadingRec] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  // const [totalBudget, setTotalBudget] = useState(0);
  const [totalRemainingBudget, setTotalRemainingBudget] = useState(0);
  const [userExpenses, setUserExpenses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        // setUserData(user);
        setIsLoggedIn(true);

        // Calculate total budget
        // setTotalBudget(user.totalBudget);

        // Calculate total remaining budget
        setTotalRemainingBudget(user.remainingBudget);

        // Fetch expenses
        const { data: expenses } = await axios.get(
          "http://localhost:8080/api/expenses/myexpenses",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserExpenses(expenses);
        
      } catch (err) {
        console.error("Failed to fetch user data or expense counts", err);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
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

    return (
      chatResponse?.choices?.[0]?.message?.content ??
      "No recommendation available."
    );
  };

  return (
    <>
      {isLoggedIn ? (
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
                    <p className="text-gray-500">
                      Analyzing your expenses and generating smart
                      recommendations...
                    </p>
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
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">You're not logged in</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your dashboard
            </p>
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
