import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building,
  Award,
  Target,
  Globe,
  CheckCircle,
  ArrowRight,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import FooterHomepage from "./FooterHomepage";

const AboutPage = () => {
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
            About FinTrak
          </h1>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto mb-10">
            Simplifying expense management for businesses of all sizes since
            2018.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src="/about-team.jpg"
                alt="FinTrak Team"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 mb-4">
                FinTrak was founded in 2018 by a team of finance professionals
                and software engineers who experienced firsthand the
                frustrations of managing company expenses through spreadsheets
                and paper receipts.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a simple solution for small businesses has grown
                into a comprehensive expense management platform trusted by
                companies across the globe, from startups to enterprises.
              </p>
              <p className="text-gray-700 mb-8">
                Our mission is to eliminate the hassle of expense management,
                giving businesses and their employees more time to focus on what
                really matters - growth and innovation.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <Building className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-gray-900 font-medium">
                    Headquartered in San Francisco
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-gray-900 font-medium">
                    50+ Team Members
                  </span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-gray-900 font-medium">
                    Serving 30+ Countries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our decisions, shape our product, and
              define our culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Target className="h-10 w-10 text-blue-600" />}
              title="Customer-Centric"
              description="We obsessively focus on solving real customer problems and delivering exceptional experiences."
            />
            <ValueCard
              icon={<CheckCircle className="h-10 w-10 text-blue-600" />}
              title="Simplicity"
              description="We believe powerful solutions don't have to be complex. We strive for elegance and ease of use."
            />
            <ValueCard
              icon={<Award className="h-10 w-10 text-blue-600" />}
              title="Excellence"
              description="We set high standards and continuously improve our product, service, and ourselves."
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the people driving FinTrak's mission to simplify expense
              management worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember
              image="/team-member-1.jpg"
              name="Sarah Johnson"
              title="CEO & Co-Founder"
              bio="Former fintech executive with 15+ years of experience in financial software."
            />
            <TeamMember
              image="/team-member-2.jpg"
              name="Michael Chen"
              title="CTO & Co-Founder"
              bio="Software architect with a background in secure financial systems and cloud infrastructure."
            />
            <TeamMember
              image="/team-member-3.jpg"
              name="David Rodriguez"
              title="Chief Product Officer"
              bio="Product leader passionate about creating intuitive user experiences."
            />
            <TeamMember
              image="/team-member-4.jpg"
              name="Elena Patel"
              title="Chief Customer Officer"
              bio="Customer success expert focused on helping businesses optimize their expense workflows."
            />
          </div>

          <div className="mt-12 text-center">
            <Link to="/careers">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md inline-flex items-center">
                Join Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="py-16 bg-blue-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <MetricCard number="500+" label="Businesses Served" />
            <MetricCard number="$250M+" label="Expenses Processed" />
            <MetricCard number="30+" label="Countries" />
            <MetricCard number="4.8/5" label="Customer Rating" />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from businesses that have
              transformed their expense management with FinTrak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial
              quote="FinTrak has cut our expense processing time by 75% and eliminated most of the paper from our workflow."
              author="Alex Martinez"
              company="Vertex Solutions"
              role="Finance Director"
            />
            <Testimonial
              quote="The mobile app makes it incredibly easy for our sales team to submit expenses on the go. Approvals that used to take weeks now happen in hours."
              author="Jessica Kim"
              company="TechNova Inc"
              role="VP of Sales"
            />
            <Testimonial
              quote="The analytics dashboards give me instant visibility into spending patterns across departments, helping us make better financial decisions."
              author="Robert Wilson"
              company="Global Logistics"
              role="CFO"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-blue-50 rounded-xl shadow-md p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Ready to transform your expense management?
                </h2>
                <p className="text-gray-600 mb-0">
                  Join hundreds of businesses that trust FinTrak to simplify
                  their expense processes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/demo">
                  <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition w-full sm:w-auto">
                    Schedule Demo
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md w-full sm:w-auto">
                    Start Free Trial
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterHomepage/>
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => (
  <div className="p-6 bg-blue-50 rounded-lg text-center hover:shadow-md transition">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TeamMember = ({ image, name, title, bio }) => (
  <div className="text-center">
    <div className="mb-4 relative overflow-hidden rounded-lg">
      <img
        src={image}
        alt={name}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.src = "/api/placeholder/300/400";
          e.target.onerror = null;
        }}
      />
      <div className="absolute inset-0 bg-blue-600 opacity-0 hover:opacity-20 transition-opacity"></div>
    </div>
    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
    <p className="text-blue-600 font-medium mb-2">{title}</p>
    <p className="text-gray-600 text-sm">{bio}</p>
  </div>
);

const MetricCard = ({ number, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
      {number}
    </div>
    <div className="text-blue-100">{label}</div>
  </div>
);

const Testimonial = ({ quote, author, company, role }) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="mb-4">
      <svg
        className="h-8 w-8 text-blue-400"
        fill="currentColor"
        viewBox="0 0 32 32"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
    </div>
    <p className="text-gray-700 mb-4 italic">{quote}</p>
    <div>
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-gray-600 text-sm">
        {role}, {company}
      </p>
    </div>
  </div>
);

export default AboutPage;
