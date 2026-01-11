import { db } from "../../../../db/client";
import { activities } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookingCard from "./BookingCard";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { id } = await params;

  // Fetch activity from database
  const [activity] = await db
    .select()
    .from(activities)
    .where(eq(activities.id, id))
    .limit(1);

  if (!activity) {
    notFound();
  }

  // Parse description to extract highlights, inclusions, exclusions
  const parseDescription = (desc: string) => {
    const sections = {
      highlights: [] as string[],
      inclusions: [] as string[],
      exclusions: [] as string[],
      overview: "",
    };

    // Split by bullets and extract items
    const lines = desc.split("\n");
    let currentSection = "overview";
    let overviewText = "";

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check for section headers
      if (trimmed.toLowerCase().includes("highlight")) {
        currentSection = "highlights";
        continue;
      } else if (trimmed.toLowerCase().includes("inclusion") || trimmed.toLowerCase().includes("include")) {
        currentSection = "inclusions";
        continue;
      } else if (trimmed.toLowerCase().includes("exclusion") || trimmed.toLowerCase().includes("exclude")) {
        currentSection = "exclusions";
        continue;
      }

      // Extract bullet points
      if (trimmed.match(/^[-•*]\s+/)) {
        const text = trimmed.replace(/^[-•*]\s+/, "");
        if (currentSection === "highlights") sections.highlights.push(text);
        else if (currentSection === "inclusions") sections.inclusions.push(text);
        else if (currentSection === "exclusions") sections.exclusions.push(text);
      } else if (trimmed && currentSection === "overview") {
        overviewText += trimmed + " ";
      }
    }

    sections.overview = overviewText.trim() || desc;
    return sections;
  };

  const parsed = parseDescription(activity.description);

  const formatPrice = () => {
    const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
    if (!Number.isFinite(price) || price === 0) return "Free";
    return `${activity.currency} ${price.toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <span>/</span>
            <Link href="/activities" className="hover:text-blue-600 transition">Activities</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate max-w-md md:max-w-none">{activity.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image Section with Overlay */}
      <div className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
            {activity.imageUrl ? (
              <Image
                src={activity.imageUrl}
                alt={activity.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-700">
                <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              {/* Top badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-gray-900">4.9</span>
                </div>
              </div>

              {/* Bottom title and price */}
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-4 drop-shadow-2xl leading-tight">
                  {activity.name}
                </h1>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                  <span>From {formatPrice()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-black/5">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-blue-600">📋</span>
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {parsed.overview}
              </p>
            </section>

            {/* Highlights */}
            {parsed.highlights.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">✨</span>
                  Highlights
                </h2>
                <ul className="space-y-3">
                  {parsed.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Inclusions */}
            {parsed.inclusions.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-blue-600">✅</span>
                  What&apos;s Included
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parsed.inclusions.map((inclusion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Exclusions */}
            {parsed.exclusions.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-red-600">❌</span>
                  What&apos;s Not Included
                </h2>
                <ul className="space-y-3">
                  {parsed.exclusions.map((exclusion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Important Information */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-amber-200">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-amber-600">ℹ️</span>
                Important Information
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Instant confirmation upon booking</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Mobile voucher accepted - show on your phone</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Free cancellation up to 48 hours before the activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>English language support available</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingCard activity={activity} formatPrice={formatPrice()} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
