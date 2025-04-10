import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaRegClock,
  FaShieldAlt,
  FaMobileAlt,
  FaFileInvoiceDollar,
  FaRegLightbulb,
  FaRegCreditCard,
  FaRegBell,
  FaUsers,
  FaGlobe,
  FaExchangeAlt,
  // FaDatabase
} from "react-icons/fa";
import {
  Wallet,
  ArrowRight,
  CheckCircle,
  CloudUpload,
  BarChart4,
  Menu,
  X,
} from "lucide-react";
import FooterHomepage from "./FooterHomepage";

const ocrImage = require("./feature_ocr.jpeg");
const profile = require("./profile.png");

const FeaturesPage = () => {
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
            to="/home"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Home
          </Link>
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

      {/* Header Section */}
      <div className="bg-blue-600 py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for Expense Management
          </h1>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto mb-10">
            Discover how FinTrak simplifies expense tracking, accelerates
            reimbursements, and provides valuable insights for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-md">
                Start Free Trial
              </button>
            </Link>
            <Link to="/demo">
              <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-blue-700 transition">
                Watch Demo
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              FinTrak provides a comprehensive set of tools to manage your
              expenses efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaChartLine className="h-8 w-8 text-blue-600" />}
              title="Real-time Analytics"
              description="Track spending patterns, monitor budget compliance, and gain valuable insights with customizable dashboards and reports."
            />
            <FeatureCard
              icon={<FaRegClock className="h-8 w-8 text-blue-600" />}
              title="Streamlined Approvals"
              description="Automated workflow for swift expense approvals, with configurable rules and multi-level authorization."
            />
            <FeatureCard
              icon={<FaShieldAlt className="h-8 w-8 text-blue-600" />}
              title="Enterprise Security"
              description="Bank-level encryption, role-based access control, and comprehensive audit trails protect your financial data."
            />
            <FeatureCard
              icon={<FaMobileAlt className="h-8 w-8 text-blue-600" />}
              title="Mobile Receipt Capture"
              description="Snap photos of receipts on-the-go with our mobile app. OCR technology automatically extracts key information."
            />
            <FeatureCard
              icon={<FaFileInvoiceDollar className="h-8 w-8 text-blue-600" />}
              title="Automated Reporting"
              description="Generate detailed expense reports with customizable templates for better financial visibility and planning."
            />
            <FeatureCard
              icon={<Wallet className="h-8 w-8 text-blue-600" />}
              title="Budget Management"
              description="Create, track, and manage departmental or project-specific budgets with automated alerts for overspending."
            />
          </div>
        </div>
      </div>

      {/* Highlight Feature */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                FEATURED
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Smart Receipt Processing
              </h2>
              <p className="text-gray-600 mb-6">
                Our advanced OCR technology automatically extracts and
                categorizes data from receipts, eliminating manual entry and
                reducing errors.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Automatic merchant recognition",
                  "Intelligent expense categorization",
                  "Currency conversion for international expenses",
                  "Tax calculation and extraction",
                  "Duplicate detection to prevent double submissions",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/receipt-processing">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
            <div className="lg:w-1/2 bg-white p-4 rounded-lg shadow-lg">
              <img
                src={ocrImage}
                alt="Receipt Processing"
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take your expense management to the next level with these powerful
              capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AdvancedFeatureCard
              icon={<FaRegLightbulb className="h-6 w-6 text-blue-600" />}
              title="AI-Powered Insights"
              description="Get intelligent suggestions to optimize spending based on historical patterns."
            />
            <AdvancedFeatureCard
              icon={<FaRegCreditCard className="h-6 w-6 text-blue-600" />}
              title="Corporate Card Integration"
              description="Automatically import and reconcile corporate card transactions."
            />
            <AdvancedFeatureCard
              icon={<FaRegBell className="h-6 w-6 text-blue-600" />}
              title="Custom Alerts"
              description="Set up notifications for budget thresholds, pending approvals, and more."
            />
            <AdvancedFeatureCard
              icon={<FaUsers className="h-6 w-6 text-blue-600" />}
              title="Team Management"
              description="Organize users into teams with specific permissions and approval flows."
            />
            <AdvancedFeatureCard
              icon={<CloudUpload className="h-6 w-6 text-blue-600" />}
              title="Cloud Storage"
              description="Securely store receipts and documents with unlimited cloud storage."
            />
            <AdvancedFeatureCard
              icon={<FaGlobe className="h-6 w-6 text-blue-600" />}
              title="Multi-Currency Support"
              description="Handle expenses in multiple currencies with real-time conversion rates."
            />
            <AdvancedFeatureCard
              icon={<BarChart4 className="h-6 w-6 text-blue-600" />}
              title="Custom Reports"
              description="Build your own reports with our flexible reporting engine."
            />
            <AdvancedFeatureCard
              icon={<FaExchangeAlt className="h-6 w-6 text-blue-600" />}
              title="ERP Integration"
              description="Seamlessly connect with your accounting and ERP systems."
            />
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              FinTrak connects with your favorite business tools to create a
              unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center"
              >
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/integrations">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md inline-flex items-center">
                View All Integrations
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-blue-50 rounded-xl p-8 md:p-12 shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                {/* Replace with your image */}
                <img
                  src={profile}
                  alt="Sarah Johnson"
                  className="w-24 h-24 bg-gray-300 rounded-full object-cover"
                />
              </div>
              <div className="md:w-3/4">
                <p className="text-xl text-gray-700 italic mb-6">
                  "FinTrak has transformed how we manage expenses. The automated
                  approval process has cut our processing time by 75%, and the
                  insights we get from the analytics have helped us optimize our
                  spending across departments."
                </p>
                <div>
                  <p className="font-bold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600">CFO, Acme Corporation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have streamlined their expense
            management with FinTrak.
          </p>
          <Link to="/signup">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-md">
              Start Your Free Trial
            </button>
          </Link>
          <p className="mt-4 text-blue-200 text-sm">
            14-day free trial. No credit card required.
          </p>
        </div>
      </div>
      <FooterHomepage />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition group">
    <div className="mb-4 transform group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <div className="mt-4">
      <Link
        to={`/features/${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        Learn more <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  </div>
);

const AdvancedFeatureCard = ({ icon, title, description }) => (
  <div className="p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition flex flex-col h-full">
    <div className="mb-3 text-blue-600">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default FeaturesPage;
