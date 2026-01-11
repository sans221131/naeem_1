"use client";

import { useState } from "react";
import type { Activity } from "../../../../db/schema";
import AddToCartButton from "@/components/AddToCartButton";

interface BookingCardProps {
  activity: Activity;
  formatPrice: string;
}

export default function BookingCard({ activity, formatPrice }: BookingCardProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleBooking = () => {
    // TODO: Implement booking logic
    alert(`Booking for ${activity.name}\nDate: ${selectedDate || "Not selected"}\nAdults: ${adults}\nChildren: ${children}`);
  };

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
  const numericPrice = Number.isFinite(price) ? price : 0;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
      {/* Price Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
        <div className="text-center">
          <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">Starting from</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{formatPrice}</p>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">per person</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            min={minDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        {/* Adults */}
        <div>
          <label htmlFor="adults" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
            Adults (18+)
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
            >
              −
            </button>
            <input
              type="number"
              id="adults"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold"
            />
            <button
              type="button"
              onClick={() => setAdults(adults + 1)}
              className="w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div>
          <label htmlFor="children" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2">
            Children (0-17)
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
            >
              −
            </button>
            <input
              type="number"
              id="children"
              min="0"
              value={children}
              onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 text-center px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-semibold"
            />
            <button
              type="button"
              onClick={() => setChildren(children + 1)}
              className="w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="pt-3 sm:pt-4 border-t-2 border-gray-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-sm sm:text-base text-gray-600 font-semibold">Total</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">{formatPrice}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          item={{
            id: activity.id,
            type: "activity",
            name: activity.name,
            destinationId: activity.destinationId,
            price: numericPrice,
            currency: activity.currency,
            imageUrl: activity.imageUrl || undefined,
          }}
          variant="primary"
          className="w-full !py-3 sm:!py-4 text-base sm:text-lg mb-2 sm:mb-3"
        />

        {/* Book Now Button */}
        <button
          type="button"
          onClick={handleBooking}
          disabled={!selectedDate}
          className="w-full py-3 sm:py-4 text-base sm:text-lg rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:from-gray-100 disabled:to-gray-200 text-gray-900 font-bold shadow-md hover:shadow-lg disabled:cursor-not-allowed transition-all duration-300"
        >
          {selectedDate ? "Book Now" : "Select Date to Continue"}
        </button>

        {/* Trust Indicators */}
        <div className="pt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Instant confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free cancellation 48h prior</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Mobile voucher accepted</span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 text-center">
          Need help?{" "}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
