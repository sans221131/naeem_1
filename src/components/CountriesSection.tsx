"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Activity } from "../../db/schema";

interface Destination {
  id: string;
  name: string;
  flag: string;
  image: string;
}

const destinations: Destination[] = [
  { id: "dubai", name: "Dubai", flag: "🇦🇪", image: "/countries/dubai.jpg" },
  { id: "bali", name: "Bali", flag: "🇮🇩", image: "/countries/bali.jpg" },
  { id: "france", name: "France", flag: "🇫🇷", image: "/countries/france.jpg" },
  { id: "japan", name: "Japan", flag: "🇯🇵", image: "/countries/japan.jpg" },
  { id: "switzerland", name: "Switzerland", flag: "🇨🇭", image: "/countries/switzerland.jpg" },
];

function formatPrice(activity: Activity): string {
  const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
  if (!Number.isFinite(price) || price === 0) return "Free";
  return `${activity.currency} ${price.toFixed(2)}`;
}

function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  const cleaned = text
    .replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}…` : cleaned;
}

export default function CountriesSection({ activities }: { activities: Activity[] }) {
  const [activeDestination, setActiveDestination] = useState<string>(destinations[0].id);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => activity.destinationId === activeDestination && activity.isActive)
      .sort((a, b) => {
        // Sort by review count descending, then by name
        const reviewDiff = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
        if (reviewDiff !== 0) return reviewDiff;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 6); // Show only top 6 activities
  }, [activities, activeDestination]);

  
  const activeDestinationData = destinations.find((d) => d.id === activeDestination);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Explore Top Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
              Select a destination and discover handpicked activities curated by local experts
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold bg-white text-gray-800 ring-1 ring-gray-200 hover:shadow-md hover:bg-gray-50 transition"
            >
              View all destinations
            </Link>
          </div>
        </div>

        {/* Destination Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => {
                setActiveDestination(dest.id);
              }}
              className={[
                "group relative px-6 py-3 rounded-full font-semibold transition-all duration-300",
                "ring-1 hover:ring-2",
                activeDestination === dest.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ring-blue-500 shadow-lg shadow-blue-500/30"
                  : "bg-white text-gray-700 ring-gray-200 hover:ring-blue-300 hover:shadow-md",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{dest.flag}</span>
                <span>{dest.name}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No activities found for {activeDestinationData?.name}
            </h3>
            <p className="text-gray-500 text-sm">
              Activities with destination_id &quot;{activeDestination}&quot; will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
                <Link
                  href={`/activity/${activity.id}`}
                  key={activity.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ring-1 ring-black/5 hover:ring-blue-500/20 hover:-translate-y-1 block"
                >
                  {/* Image */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {activity.imageUrl ? (
                      <Image
                        src={activity.imageUrl}
                        alt={activity.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-900 shadow-lg">
                        <span>{activeDestinationData?.flag}</span>
                        <span>{activeDestinationData?.name}</span>
                      </span>
                      {activity.reviewCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400/95 backdrop-blur-sm text-xs font-bold text-gray-900 shadow-lg">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{activity.reviewCount}</span>
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm shadow-xl">
                        {formatPrice(activity)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {activity.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {truncate(activity.description, 120)}
                    </p>
                    
                    <div className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-blue-100 text-gray-900 font-semibold text-sm transition-all duration-300 ring-1 ring-gray-200 group-hover:ring-blue-300 group-hover:shadow-md text-center">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
        )}
      </div>
    </section>
  );
}
