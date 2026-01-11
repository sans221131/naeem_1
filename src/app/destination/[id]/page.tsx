import { db } from "../../../../db/client";
import { activities } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
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

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { id } = await params;
  
  const destination = destinationInfo[id];
  
  // Fetch activities for this destination
  const destinationActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.destinationId, id))
    .orderBy(activities.reviewCount);

  const activeActivities = destinationActivities.filter(a => a.isActive);

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
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-900 shadow-lg">
                        <span>{destination?.flag}</span>
                        <span>{destination?.name}</span>
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
          </>
        )}
      </div>
    </main>
  );
}
