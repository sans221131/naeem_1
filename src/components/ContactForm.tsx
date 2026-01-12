"use client";

import { useState } from "react";
import { X, Mail, Phone, User, MessageSquare } from "lucide-react";
import type { CartItem } from "@/contexts/CartContext";

interface ContactFormProps {
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

export default function ContactForm({ onClose, cartItems, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Log cart items for debugging
  console.log("ContactForm cartItems:", cartItems, "Length:", cartItems?.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cartItems,
          sourcePage: "/cart",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      onSuccess();
    } catch (err) {
      setError("Failed to submit enquiry. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/90 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-black mb-1">Contact Us</h2>
            <p className="text-white/80 text-sm">We&apos;ll get back to you within 24 hours</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg smooth-hover"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(90vh-100px)] overflow-y-auto">        {/* Cart Items Summary */}
          {cartItems && cartItems.length > 0 && (
            <div className="bg-gradient-to-br from-[#FAF7F2] to-white border-2 border-[#E7E2D9] rounded-xl p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#0F172A]">Your Selected Items</h3>
                <span className="px-3 py-1 bg-[#0EA5A4] text-white text-xs font-bold rounded-full">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white/60 rounded-lg p-3 border border-[#E7E2D9]">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        {item.type === 'activity' ? (
                          <svg className="w-5 h-5 text-[#0EA5A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0F172A] text-sm">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#0EA5A4]/10 text-[#0EA5A4]">
                            {item.type === 'activity' ? 'Activity' : 'Destination'}
                          </span>
                          {item.destinationName && (
                            <span className="text-xs text-[#64748B]">📍 {item.destinationName}</span>
                          )}
                          {item.price > 0 && (
                            <span className="text-xs font-semibold text-[#0F172A]">
                              {item.currency} {item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#E7E2D9]">
                <p className="text-xs text-[#64748B]">
                  💡 These items will be included in your enquiry for personalized assistance
                </p>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-[#0F172A] mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#E7E2D9] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all outline-none smooth-hover"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#0F172A] mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#E7E2D9] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all outline-none smooth-hover"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-bold text-[#0F172A] mb-2">
              Phone Number
            </label>
            <div className="flex gap-3">
              <select
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="px-3 py-3 rounded-xl border-2 border-[#E7E2D9] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all outline-none smooth-hover"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+971">+971</option>
                <option value="+20">+20</option>
                <option value="+34">+34</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
                <option value="+39">+39</option>
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#E7E2D9] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all outline-none smooth-hover"
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-bold text-[#0F172A] mb-2">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#E7E2D9] focus:border-[#0EA5A4] focus:ring-2 focus:ring-[#0EA5A4]/20 transition-all outline-none resize-none smooth-hover"
                placeholder="Tell us about your travel plans or any questions you have..."
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] px-4 py-3 rounded-xl text-sm animate-slide-in">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/90 hover:from-[#0EA5A4]/90 hover:to-[#0EA5A4] disabled:from-[#E7E2D9] disabled:to-[#E7E2D9] text-white font-bold text-lg shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300 smooth-hover"
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>

          <p className="text-xs text-[#64748B] text-center">
            By submitting, you agree to receive communications from YourBrand Tours
          </p>
        </form>
      </div>
    </div>
  );
}
