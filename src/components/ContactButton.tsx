"use client";

import { useState } from "react";
import ContactForm from "./ContactForm";
import { Mail } from "lucide-react";

interface ContactButtonProps {
  variant?: "primary" | "secondary" | "floating";
  sourcePage?: string;
  className?: string;
}

export default function ContactButton({ 
  variant = "primary", 
  sourcePage = "/", 
  className = "" 
}: ContactButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const variantClasses = {
    primary: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl",
    secondary: "px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-full font-semibold",
    floating: "fixed bottom-8 right-8 z-40 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-xl hover:scale-110",
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-bold">Message Sent!</p>
            <p className="text-sm text-green-100">We&apos;ll be in touch soon</p>
          </div>
        </div>
      )}

      {showForm && (
        <ContactForm
          onClose={() => setShowForm(false)}
          cartItems={[]}
          onSuccess={handleSuccess}
        />
      )}

      <button
        onClick={() => setShowForm(true)}
        className={`${variantClasses[variant]} transition-all duration-300 ${className} inline-flex items-center gap-2`}
      >
        <Mail className="w-5 h-5" />
        {variant !== "floating" && <span>Contact Us</span>}
      </button>
    </>
  );
}
