"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-[#E7E2D9] backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#0EA5A4] hover:text-[#0EA5A4]/80 transition-all smooth-hover animate-fade-in">
              YourBrand Tours
            </Link>
          </div>

          {/* Desktop Navigation (only site pages) */}
          <nav className="hidden md:flex items-center space-x-6 text-[#64748B] font-medium">
            <Link href="/destinations" className="hover:text-[#0EA5A4] transition-colors smooth-hover">
              Destinations
            </Link>
            <Link href="/#faq" className="hover:text-[#0EA5A4] transition-colors smooth-hover">
              FAQ
            </Link>
            <button onClick={async () => {
              try {
                const res = await fetch('/countries/manifest.json');
                const data = await res.json();
                const keys = Object.keys(data || {});
                if (keys.length === 0) return;
                const random = keys[Math.floor(Math.random() * keys.length)];
                router.push(`/destination/${encodeURIComponent(random)}`);
              } catch (e) {
                console.error('Failed to open random country', e);
              }
            }} className="hover:text-[#0EA5A4] transition-colors smooth-hover">Random Country</button>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative text-[#0F172A] hover:text-[#0EA5A4] transition-all smooth-hover p-2 rounded-lg hover:bg-[#FAF7F2]"
            >
              <ShoppingCart className="w-6 h-6" />
              {isMounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
            <a href="tel:+1234567890" className="text-[#0F172A] hover:text-[#0EA5A4] flex items-center gap-2 smooth-hover p-2 rounded-lg hover:bg-[#FAF7F2] transition-all" aria-label="Call support">
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
              <span className="hidden md:inline">Help</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#0F172A] hover:text-[#0EA5A4] transition-all smooth-hover p-2 rounded-lg hover:bg-[#FAF7F2]"
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
          <div className="md:hidden pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link href="/destinations" className="text-[#0F172A] hover:text-[#0EA5A4] font-medium smooth-hover py-2 px-3 rounded-lg hover:bg-[#FAF7F2]">
                Destinations
              </Link>
              <Link href="/#faq" className="text-[#0F172A] hover:text-[#0EA5A4] font-medium smooth-hover py-2 px-3 rounded-lg hover:bg-[#FAF7F2]">
                FAQ
              </Link>
              <button onClick={async () => {
                try {
                  const res = await fetch('/countries/manifest.json');
                  const data = await res.json();
                  const keys = Object.keys(data || {});
                  if (keys.length === 0) return;
                  const random = keys[Math.floor(Math.random() * keys.length)];
                  router.push(`/destination/${encodeURIComponent(random)}`);
                } catch (e) {
                  console.error('Failed to open random country', e);
                }
              }} className="text-[#0F172A] hover:text-[#0EA5A4] font-medium text-left smooth-hover py-2 px-3 rounded-lg hover:bg-[#FAF7F2]">Random Country</button>
              <Link href="/cart" className="text-[#0F172A] hover:text-[#0EA5A4] font-medium flex items-center gap-2 smooth-hover py-2 px-3 rounded-lg hover:bg-[#FAF7F2]">
                Cart
                {isMounted && itemCount > 0 && (
                  <span className="bg-[#F97316] text-white text-xs font-bold rounded-full px-2 py-0.5 animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </Link>
              <a href="tel:+1234567890" className="text-[#0F172A] hover:text-[#0EA5A4] font-medium smooth-hover py-2 px-3 rounded-lg hover:bg-[#FAF7F2]">
                Help
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
