import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FileText, ThumbsUp, Settings } from 'lucide-react';

export default function SidebarEmployee() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/expenses/new', icon: PlusCircle, label: 'New Expense' },
    { to: '/expenses', icon: FileText, label: 'My Expenses' },
    { to: '/recommendation', icon: ThumbsUp, label: 'Recommendation' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-md border-r border-gray-100 min-h-screen">
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                  isActive(link.to)
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(link.to)
                      ? 'text-blue-700'
                      : 'text-gray-400 group-hover:text-blue-500'
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}