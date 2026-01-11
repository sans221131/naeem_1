"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ActivityCard from "@/components/ActivityCard";
import type { Activity } from "../../../../db/schema";

interface DestinationPageProps {
  params: Promise<{ id: string }>;
}

// Map of destination IDs to display names and flags
const destinationInfo: Record<string, { name: string; flag: string; image: string }> = {
  argentina: { name: "Argentina", flag: "🇦🇷", image: "/countries/argentina.webp" },
  australia: { name: "Australia", flag: "🇦🇺", image: "/countries/australia.webp" },
  austria: { name: "Austria", flag: "🇦🇹", image: "/countries/austria.jpg" },
  bali: { name: "Bali", flag: "🇮🇩", image: "/countries/bali.jpg" },
  belgium: { name: "Belgium", flag: "🇧🇪", image: "/countries/belgium.jpg" },
  brazil: { name: "Brazil", flag: "🇧🇷", image: "/countries/brazil.jpg" },
  bulgaria: { name: "Bulgaria", flag: "🇧🇬", image: "/countries/bulgaria.jpg" },
  canada: { name: "Canada", flag: "🇨🇦", image: "/countries/canada.webp" },
  china: { name: "China", flag: "🇨🇳", image: "/countries/china.jpg" },
  croatia: { name: "Croatia", flag: "🇭🇷", image: "/countries/coratia.jpg" },
  cuba: { name: "Cuba", flag: "🇨🇺", image: "/countries/cuba.jpg" },
  czechia: { name: "Czechia", flag: "🇨🇿", image: "/countries/czechia.jpeg" },
  denmark: { name: "Denmark", flag: "🇩🇰", image: "/countries/denmark.jpg" },
  dominican: { name: "Dominican Republic", flag: "🇩🇴", image: "/countries/dominican.jpg" },
  dubai: { name: "Dubai", flag: "🇦🇪", image: "/countries/dubai.jpg" },
  egypt: { name: "Egypt", flag: "🇪🇬", image: "/countries/egypt.avif" },
  france: { name: "France", flag: "🇫🇷", image: "/countries/france.jpg" },
  germany: { name: "Germany", flag: "🇩🇪", image: "/countries/germany.webp" },
  greece: { name: "Greece", flag: "🇬🇷", image: "/countries/greece.jpg" },
  hungary: { name: "Hungary", flag: "🇭🇺", image: "/countries/hungary.jpg" },
  india: { name: "India", flag: "🇮🇳", image: "/countries/india.jpg" },
  ireland: { name: "Ireland", flag: "🇮🇪", image: "/countries/ireland.webp" },
  italy: { name: "Italy", flag: "🇮🇹", image: "/countries/italy.jpg" },
  jamaica: { name: "Jamaica", flag: "🇯🇲", image: "/countries/jamiaca.jpg" },
  japan: { name: "Japan", flag: "🇯🇵", image: "/countries/japan.jpg" },
  jordan: { name: "Jordan", flag: "🇯🇴", image: "/countries/jordan.webp" },
  london: { name: "London", flag: "🇬🇧", image: "/countries/london.jpg" },
  malaysia: { name: "Malaysia", flag: "🇲🇾", image: "/countries/malaysia.webp" },
  mexico: { name: "Mexico", flag: "🇲🇽", image: "/countries/mexico.avif" },
  morocco: { name: "Morocco", flag: "🇲🇦", image: "/countries/morocco.avif" },
  netherlands: { name: "Netherlands", flag: "🇳🇱", image: "/countries/netherlands.avif" },
  newzealand: { name: "New Zealand", flag: "🇳🇿", image: "/countries/newzealand.webp" },
  norway: { name: "Norway", flag: "🇳🇴", image: "/countries/Norway.jpg" },
  poland: { name: "Poland", flag: "🇵🇱", image: "/countries/poland.avif" },
  portugal: { name: "Portugal", flag: "🇵🇹", image: "/countries/portugal.jpg" },
  qatar: { name: "Qatar", flag: "🇶🇦", image: "/countries/qatar.jpg" },
  romania: { name: "Romania", flag: "🇷🇴", image: "/countries/romania.jpg" },
  saudi: { name: "Saudi Arabia", flag: "🇸🇦", image: "/countries/saudi.jpg" },
  singapore: { name: "Singapore", flag: "🇸🇬", image: "/countries/singapore.webp" },
  southafrica: { name: "South Africa", flag: "🇿🇦", image: "/countries/southafrica.jpg" },
  southkorea: { name: "South Korea", flag: "🇰🇷", image: "/countries/southkorea.jpg" },
  spain: { name: "Spain", flag: "🇪🇸", image: "/countries/spain.webp" },
  sweden: { name: "Sweden", flag: "🇸🇪", image: "/countries/sweden.webp" },
  switzerland: { name: "Switzerland", flag: "🇨🇭", image: "/countries/switzerland.jpg" },
  thailand: { name: "Thailand", flag: "🇹🇭", image: "/countries/thailand.jpg" },
  tunisia: { name: "Tunisia", flag: "🇹🇳", image: "/countries/tunisia.webp" },
  turkey: { name: "Turkey", flag: "🇹🇷", image: "/countries/turkey.jpg" },
  "united-states": { name: "United States", flag: "🇺🇸", image: "/countries/united-states.jpg" },
  vietnam: { name: "Vietnam", flag: "🇻🇳", image: "/countries/vietnam.webp" },
};

function formatPrice(activity: Activity): string {
  const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
  if (!Number.isFinite(price) || price === 0) return "Free";
  return `${activity.currency} ${price.toFixed(2)}`;
}

export default function DestinationPage() {
  const params = useParams();
  const id = params.id as string;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const destination = destinationInfo[id];

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(`/api/destinations/${id}/activities`);
        if (response.ok) {
          const data = await response.json() as Activity[];
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [id]);

  const activeActivities = activities.filter(a => a.isActive);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-blue-600 transition">Destinations</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{destination?.name || id}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            {destination?.image && (
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl md:text-6xl">{destination?.flag}</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 drop-shadow-2xl">
                {destination?.name || id}
              </h1>
              <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
                {activeActivities.length} {activeActivities.length === 1 ? 'activity' : 'activities'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {activeActivities.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              No activities found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We&apos;re currently adding activities for {destination?.name || id}. Check back soon!
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Browse Other Destinations
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Available Activities
              </h2>
              <p className="text-gray-600">
                Explore the best experiences in {destination?.name || id}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  destination={destination}
                  formatPrice={formatPrice(activity)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
