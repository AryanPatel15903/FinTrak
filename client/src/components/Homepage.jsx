import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaRegClock,
  FaShieldAlt,
  FaMobileAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { Wallet, ArrowRight, CheckCircle, Menu, X } from "lucide-react";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <Wallet className="h-8 w-8 text-blue-600 transform hover:scale-110 transition-transform" />
          <span className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            FinTrak
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/features"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            About
          </Link>
          <div className="space-x-4">
            <Link to="/login">
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 absolute w-full z-40">
          <div className="flex flex-col space-y-4">
            <Link
              to="/features"
              className="text-gray-600 hover:text-blue-600 transition p-2"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-blue-600 transition p-2"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600 transition p-2"
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login">
                <button className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              #1 Expense Management Solution
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Manage Your Expenses{" "}
              <span className="text-blue-600 relative">
                Smarter
                <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-200 -z-10"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Track, manage, and optimize your expense reimbursements with our
              powerful digital solution that saves time and eliminates
              paperwork.
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Link to="/signup">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link to="/demo">
                <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition w-full sm:w-auto">
                  Watch Demo
                </button>
              </Link>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              No credit card required for trial
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
                  {/* <!-- Dashboard Background --> */}
                  <rect width="800" height="500" fill="#f8fafc" rx="8" ry="8" />

                  {/* <!-- Header Bar --> */}
                  <rect
                    x="0"
                    y="0"
                    width="800"
                    height="60"
                    fill="#ffffff"
                    rx="8"
                    ry="8"
                  />
                  <rect
                    x="20"
                    y="20"
                    width="120"
                    height="20"
                    fill="#e2e8f0"
                    rx="4"
                    ry="4"
                  />
                  <circle cx="740" cy="30" r="15" fill="#e2e8f0" />
                  <rect
                    x="660"
                    y="20"
                    width="60"
                    height="20"
                    fill="#e2e8f0"
                    rx="4"
                    ry="4"
                  />

                  {/* <!-- Sidebar --> */}
                  <rect x="0" y="60" width="200" height="440" fill="#ffffff" />
                  <rect
                    x="20"
                    y="90"
                    width="160"
                    height="40"
                    fill="#3b82f6"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="30"
                    y="105"
                    width="20"
                    height="10"
                    fill="#ffffff"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="60"
                    y="105"
                    width="80"
                    height="10"
                    fill="#ffffff"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="20"
                    y="140"
                    width="160"
                    height="40"
                    fill="#f1f5f9"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="30"
                    y="155"
                    width="20"
                    height="10"
                    fill="#64748b"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="60"
                    y="155"
                    width="80"
                    height="10"
                    fill="#64748b"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="20"
                    y="190"
                    width="160"
                    height="40"
                    fill="#f1f5f9"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="30"
                    y="205"
                    width="20"
                    height="10"
                    fill="#64748b"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="60"
                    y="205"
                    width="80"
                    height="10"
                    fill="#64748b"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="20"
                    y="240"
                    width="160"
                    height="40"
                    fill="#f1f5f9"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="30"
                    y="255"
                    width="20"
                    height="10"
                    fill="#64748b"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="60"
                    y="255"
                    width="80"
                    height="10"
                    fill="#64748b"
                    rx="2"
                    ry="2"
                  />

                  {/* <!-- Main Content Area --> */}
                  <rect
                    x="220"
                    y="80"
                    width="560"
                    height="100"
                    fill="#ffffff"
                    rx="8"
                    ry="8"
                    stroke="#e2e8f0"
                    stroke-width="1"
                  />

                  {/* <!-- Stats Cards --> */}
                  <rect
                    x="230"
                    y="90"
                    width="170"
                    height="70"
                    fill="#f0f9ff"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="240"
                    y="100"
                    width="90"
                    height="12"
                    fill="#bae6fd"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="240"
                    y="120"
                    width="60"
                    height="25"
                    fill="#0ea5e9"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="310"
                    y="120"
                    width="80"
                    height="8"
                    fill="#bae6fd"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="310"
                    y="135"
                    width="50"
                    height="8"
                    fill="#bae6fd"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="415"
                    y="90"
                    width="170"
                    height="70"
                    fill="#f0fdf4"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="425"
                    y="100"
                    width="90"
                    height="12"
                    fill="#bbf7d0"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="425"
                    y="120"
                    width="60"
                    height="25"
                    fill="#22c55e"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="495"
                    y="120"
                    width="80"
                    height="8"
                    fill="#bbf7d0"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="495"
                    y="135"
                    width="50"
                    height="8"
                    fill="#bbf7d0"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="600"
                    y="90"
                    width="170"
                    height="70"
                    fill="#fff7ed"
                    rx="6"
                    ry="6"
                  />
                  <rect
                    x="610"
                    y="100"
                    width="90"
                    height="12"
                    fill="#fed7aa"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="610"
                    y="120"
                    width="60"
                    height="25"
                    fill="#f97316"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="680"
                    y="120"
                    width="80"
                    height="8"
                    fill="#fed7aa"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="680"
                    y="135"
                    width="50"
                    height="8"
                    fill="#fed7aa"
                    rx="2"
                    ry="2"
                  />

                  {/* <!-- Chart Section --> */}
                  <rect
                    x="220"
                    y="200"
                    width="360"
                    height="280"
                    fill="#ffffff"
                    rx="8"
                    ry="8"
                    stroke="#e2e8f0"
                    stroke-width="1"
                  />
                  <rect
                    x="230"
                    y="210"
                    width="100"
                    height="20"
                    fill="#e2e8f0"
                    rx="4"
                    ry="4"
                  />

                  {/* <!-- Line Chart --> */}
                  <polyline
                    points="240,400 290,350 340,375 390,320 440,300 490,330 540,280"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="3"
                  />
                  <circle cx="240" cy="400" r="4" fill="#3b82f6" />
                  <circle cx="290" cy="350" r="4" fill="#3b82f6" />
                  <circle cx="340" cy="375" r="4" fill="#3b82f6" />
                  <circle cx="390" cy="320" r="4" fill="#3b82f6" />
                  <circle cx="440" cy="300" r="4" fill="#3b82f6" />
                  <circle cx="490" cy="330" r="4" fill="#3b82f6" />
                  <circle cx="540" cy="280" r="4" fill="#3b82f6" />

                  {/* <!-- X-axis --> */}
                  <line
                    x1="240"
                    y1="420"
                    x2="540"
                    y2="420"
                    stroke="#cbd5e1"
                    stroke-width="1"
                  />
                  <rect
                    x="240"
                    y="425"
                    width="20"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="290"
                    y="425"
                    width="20"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="340"
                    y="425"
                    width="20"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="390"
                    y="425"
                    width="20"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="440"
                    y="425"
                    width="20"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="490"
                    y="425"
                    width="20"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />

                  {/* <!-- Recent Transactions --> */}
                  <rect
                    x="600"
                    y="200"
                    width="180"
                    height="280"
                    fill="#ffffff"
                    rx="8"
                    ry="8"
                    stroke="#e2e8f0"
                    stroke-width="1"
                  />
                  <rect
                    x="610"
                    y="210"
                    width="140"
                    height="20"
                    fill="#e2e8f0"
                    rx="4"
                    ry="4"
                  />

                  {/* <!-- Transaction Items --> */}
                  <rect
                    x="610"
                    y="240"
                    width="160"
                    height="40"
                    fill="#f8fafc"
                    rx="4"
                    ry="4"
                  />
                  <circle cx="625" cy="260" r="10" fill="#3b82f6" />
                  <rect
                    x="645"
                    y="250"
                    width="80"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="645"
                    y="265"
                    width="40"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="740"
                    y="255"
                    width="20"
                    height="10"
                    fill="#3b82f6"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="610"
                    y="290"
                    width="160"
                    height="40"
                    fill="#f8fafc"
                    rx="4"
                    ry="4"
                  />
                  <circle cx="625" cy="310" r="10" fill="#22c55e" />
                  <rect
                    x="645"
                    y="300"
                    width="80"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="645"
                    y="315"
                    width="40"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="740"
                    y="305"
                    width="20"
                    height="10"
                    fill="#22c55e"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="610"
                    y="340"
                    width="160"
                    height="40"
                    fill="#f8fafc"
                    rx="4"
                    ry="4"
                  />
                  <circle cx="625" cy="360" r="10" fill="#f97316" />
                  <rect
                    x="645"
                    y="350"
                    width="80"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="645"
                    y="365"
                    width="40"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="740"
                    y="355"
                    width="20"
                    height="10"
                    fill="#f97316"
                    rx="2"
                    ry="2"
                  />

                  <rect
                    x="610"
                    y="390"
                    width="160"
                    height="40"
                    fill="#f8fafc"
                    rx="4"
                    ry="4"
                  />
                  <circle cx="625" cy="410" r="10" fill="#3b82f6" />
                  <rect
                    x="645"
                    y="400"
                    width="80"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="645"
                    y="415"
                    width="40"
                    height="10"
                    fill="#cbd5e1"
                    rx="2"
                    ry="2"
                  />
                  <rect
                    x="740"
                    y="405"
                    width="20"
                    height="10"
                    fill="#3b82f6"
                    rx="2"
                    ry="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 mb-8">
            Trusted by 500+ companies worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {[
              "Company A",
              "Company B",
              "Company C",
              "Company D",
              "Company E",
            ].map((company) => (
              <div key={company} className="h-8 flex items-center">
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your expenses efficiently and get
              reimbursed faster.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaChartLine className="h-8 w-8 text-blue-600" />}
              title="Real-time Tracking"
              description="Monitor your expenses and reimbursements in real-time with detailed analytics and insights."
            />
            <FeatureCard
              icon={<FaRegClock className="h-8 w-8 text-blue-600" />}
              title="Quick Processing"
              description="Streamlined approval process for faster reimbursement processing and payments."
            />
            <FeatureCard
              icon={<FaShieldAlt className="h-8 w-8 text-blue-600" />}
              title="Secure & Reliable"
              description="Enterprise-grade security to protect your financial data and transaction history."
            />
            <FeatureCard
              icon={<FaMobileAlt className="h-8 w-8 text-blue-600" />}
              title="Mobile Friendly"
              description="Capture receipts and submit expenses on the go with our mobile application."
            />
            <FeatureCard
              icon={<FaFileInvoiceDollar className="h-8 w-8 text-blue-600" />}
              title="Automated Reports"
              description="Generate detailed expense reports with just a few clicks for better financial planning."
            />
            <FeatureCard
              icon={<Wallet className="h-8 w-8 text-blue-600" />}
              title="Budget Management"
              description="Set and track departmental budgets to maintain financial discipline across your organization."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Expense Management?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have streamlined their expense
            tracking and reimbursement process.
          </p>
          <Link to="/signup">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-md">
              Get Started For Free
            </button>
          </Link>
          <p className="mt-4 text-blue-200 text-sm">
            14-day free trial. No credit card required.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wallet className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">FinTrak</span>
              </div>
              <p className="text-sm">
                Simplifying expense management for businesses of all sizes.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/features"
                    className="hover:text-blue-400 transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-blue-400 transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/integrations"
                    className="hover:text-blue-400 transition"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/enterprise"
                    className="hover:text-blue-400 transition"
                  >
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/blog" className="hover:text-blue-400 transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-blue-400 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="hover:text-blue-400 transition">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="hover:text-blue-400 transition">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-blue-400 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-blue-400 transition"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-blue-400 transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 FinTrak. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/home" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="/home" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="/home" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition group">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <div className="mt-4">
      <Link
        to="/features"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        Learn more <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  </div>
);

export default Homepage;
