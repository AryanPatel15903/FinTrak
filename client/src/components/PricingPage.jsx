import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, X, HelpCircle, ArrowRight } from "lucide-react";
import { Wallet, Menu } from "lucide-react";
import FooterHomepage from "./FooterHomepage";

const PricingPage = () => {
  const [annual, setAnnual] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses and startups",
      price: annual ? 15 : 19,
      features: [
        "Up to 5 users",
        "Receipt scanning & categorization",
        "Basic expense reporting",
        "Email support",
        "Mobile app access",
      ],
      notIncluded: [
        "Custom approval workflows",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
      ],
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses",
      price: annual ? 29 : 39,
      popular: true,
      features: [
        "Up to 20 users",
        "Receipt scanning & categorization",
        "Advanced expense reporting",
        "Custom approval workflows",
        "Basic analytics",
        "Priority email & chat support",
        "Mobile app access",
        "Basic integrations",
      ],
      notIncluded: ["API access", "Dedicated account manager"],
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex needs",
      price: "Custom",
      features: [
        "Unlimited users",
        "Receipt scanning & categorization",
        "Advanced expense reporting",
        "Custom approval workflows",
        "Advanced analytics & insights",
        "24/7 priority support",
        "Mobile app access",
        "Advanced integrations",
        "API access",
        "Dedicated account manager",
        "Custom training",
        "SSO & advanced security",
      ],
      notIncluded: [],
    },
  ];

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
            Simple, Transparent Pricing
          </h1>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto mb-10">
            Choose the plan that fits your business needs. All plans include our
            core expense management features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-blue-700 p-1 rounded-lg mb-10">
            <button
              className={`px-4 py-2 rounded-md transition ${
                annual ? "bg-white text-blue-600" : "text-blue-100"
              }`}
              onClick={() => setAnnual(true)}
            >
              Annual
              {annual && (
                <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              )}
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${
                !annual ? "bg-white text-blue-600" : "text-blue-100"
              }`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-16 -mt-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden ${
                  plan.popular
                    ? "ring-2 ring-blue-500 transform md:-translate-y-4"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    {typeof plan.price === "number" ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600 ml-2">
                          / user / month
                        </span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </div>
                    )}
                    {annual && typeof plan.price === "number" && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually (${plan.price * 12}/year)
                      </div>
                    )}
                  </div>
                  <Link
                    to={plan.name === "Enterprise" ? "/contact" : "/signup"}
                  >
                    <button
                      className={`w-full py-3 px-4 rounded-lg transition mb-6 ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Start Free Trial"}
                    </button>
                  </Link>

                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                    What's included:
                  </h4>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                        Not included:
                      </h4>
                      <ul className="space-y-3 text-gray-500">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See exactly what's included in each plan to find the right fit for
              your business.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50"></th>
                  {plans.map((plan, i) => (
                    <th
                      key={i}
                      className={`text-center p-4 ${
                        plan.popular ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </span>
                      {plan.popular && (
                        <div className="text-sm mt-1 inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Popular
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <FeatureRow
                  title="Users"
                  values={["Up to 5", "Up to 20", "Unlimited"]}
                  popular={1}
                />
                <FeatureRow
                  title="Receipt Scanning"
                  values={["Basic", "Advanced", "Advanced"]}
                  popular={1}
                  tooltip="Extract data from receipts using OCR technology"
                />
                <FeatureRow
                  title="Expense Reports"
                  values={["Basic", "Advanced", "Advanced"]}
                  popular={1}
                />
                <FeatureRow
                  title="Approval Workflows"
                  values={["Single-level", "Multi-level", "Custom"]}
                  popular={1}
                />
                <FeatureRow
                  title="Analytics"
                  values={["Basic", "Standard", "Advanced"]}
                  popular={1}
                />
                <FeatureRow
                  title="Support"
                  values={["Email", "Email & Chat", "24/7 Priority"]}
                  popular={1}
                />
                <FeatureRow
                  title="Mobile App"
                  values={["✓", "✓", "✓"]}
                  popular={1}
                />
                <FeatureRow
                  title="Integrations"
                  values={["Limited", "Basic", "Advanced"]}
                  popular={1}
                />
                <FeatureRow
                  title="API Access"
                  values={["✕", "✕", "✓"]}
                  popular={1}
                />
                <FeatureRow
                  title="Dedicated Account Manager"
                  values={["✕", "✕", "✓"]}
                  popular={1}
                />
                <FeatureRow
                  title="Custom Training"
                  values={["✕", "✕", "✓"]}
                  popular={1}
                />
                <FeatureRow
                  title="SSO & Advanced Security"
                  values={["✕", "✕", "✓"]}
                  popular={1}
                />
                <tr>
                  <td className="p-4 border-t"></td>
                  {plans.map((plan, i) => (
                    <td
                      key={i}
                      className={`text-center p-4 border-t ${
                        plan.popular ? "bg-blue-50" : ""
                      }`}
                    >
                      <Link
                        to={plan.name === "Enterprise" ? "/contact" : "/signup"}
                      >
                        <button
                          className={`py-2 px-4 rounded-lg transition ${
                            plan.popular
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {plan.name === "Enterprise"
                            ? "Contact Sales"
                            : "Start Free Trial"}
                        </button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have more questions? We're here to help.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <FAQ
                question="How does the 14-day free trial work?"
                answer="You'll get full access to all features of your selected plan for 14 days, with no credit card required. At the end of the trial, you can choose to subscribe or your account will be automatically downgraded to our limited free plan."
              />
              <FAQ
                question="Can I switch plans later?"
                answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be effective immediately. If you downgrade, the new pricing will take effect at the start of your next billing cycle."
              />
              <FAQ
                question="How do you calculate the per-user price?"
                answer="The per-user price is based on the number of active users in your account who can submit, approve, or manage expenses. You only pay for users who actively use the system."
              />
              <FAQ
                question="Do you offer discounts for non-profits or educational institutions?"
                answer="Yes, we offer special pricing for non-profit organizations and educational institutions. Please contact our sales team to learn more about our discount programs."
              />
              <FAQ
                question="Can I integrate FinTrak with my accounting software?"
                answer="Yes, FinTrak integrates with popular accounting software like QuickBooks, Xero, and Sage. Professional and Enterprise plans include more advanced integration capabilities."
              />
              <FAQ
                question="Is there a limit to how many expenses I can process?"
                answer="No, all plans include unlimited expense processing. You can submit as many expenses as you need without any additional charges."
              />
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Link to="/contact">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md inline-flex items-center">
                  Contact Our Sales Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Streamline Your Expense Management?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your 14-day free trial today and see how FinTrak can transform
            your expense process.
          </p>
          <Link to="/signup">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-md">
              Get Started For Free
            </button>
          </Link>
          <p className="mt-4 text-blue-200 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
      <FooterHomepage/>
    </div>
  );
};

const FeatureRow = ({ title, values, popular, tooltip }) => (
  <tr className="border-t border-gray-100">
    <td className="p-4 text-gray-900 font-medium flex items-center">
      {title}
      {tooltip && (
        <div className="relative inline-block ml-2 group">
          <HelpCircle className="h-4 w-4 text-gray-400" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
            {tooltip}
          </div>
        </div>
      )}
    </td>
    {values.map((value, i) => (
      <td
        key={i}
        className={`text-center p-4 ${i === popular ? "bg-blue-50" : ""}`}
      >
        {value === "✓" ? (
          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
        ) : value === "✕" ? (
          <X className="h-5 w-5 text-gray-400 mx-auto" />
        ) : (
          value
        )}
      </td>
    ))}
  </tr>
);

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`mt-2 pr-8 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

export default PricingPage;
