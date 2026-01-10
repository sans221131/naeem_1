"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              YourBrand Tours
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/activities"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Activities
            </Link>
            <Link
              href="/holidays"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Holidays
            </Link>
            <Link
              href="/visas"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Visas
            </Link>
            <Link
              href="/cruises"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Cruises
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Helpline
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/activities" className="text-gray-700 hover:text-blue-600 font-medium">
                Activities
              </Link>
              <Link href="/holidays" className="text-gray-700 hover:text-blue-600 font-medium">
                Holidays
              </Link>
              <Link href="/visas" className="text-gray-700 hover:text-blue-600 font-medium">
                Visas
              </Link>
              <Link href="/cruises" className="text-gray-700 hover:text-blue-600 font-medium">
                Cruises
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
