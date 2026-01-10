import { db } from "../../db/client";
import { Activity } from "../../db/schema";
import { sql } from "drizzle-orm";
import HeroBanner from "../components/HeroBanner";
import CountriesSection from "../components/CountriesSection";

export default async function Home() {
  // fetch a larger pool so we can filter server-side for activities that
  // contain bullet-style lines in their description
  const result = await db.execute(
    sql`SELECT id, destination_id, name, description, price, currency, review_count, image_url, is_active, created_at, updated_at FROM activities WHERE is_active = true ORDER BY RANDOM() LIMIT 20`
  );
  
  const rawActivities = (result.rows ?? result) as Record<string, unknown>[];

  type ActivityView = Activity;

  // Map snake_case database fields to camelCase for components
  const randomActivities: ActivityView[] = rawActivities.map((activity) => ({
    id: String(activity["id"] ?? ""),
    destinationId: String(activity["destination_id"] ?? activity["destinationId"] ?? ""),
    name: String(activity["name"] ?? ""),
    description: String(activity["description"] ?? ""),
    // Drizzle/pg-core maps numeric to string in select types, keep string here
    price: String(activity["price"] ?? "0"),
    currency: String(activity["currency"] ?? ""),
    reviewCount: Number(activity["review_count"] ?? activity["reviewCount"] ?? 0),
    imageUrl: String(activity["image_url"] ?? activity["imageUrl"] ?? ""),
    isActive: Boolean(activity["is_active"] ?? activity["isActive"] ?? true),
    createdAt: new Date(String(activity["created_at"] ?? activity["createdAt"] ?? "")),
    updatedAt: new Date(String(activity["updated_at"] ?? activity["updatedAt"] ?? "")),
  }));

  // Helper: detect bullet-like lines in description.
  // We consider lines starting with -, • or * followed by space as bullets.
  function hasBullets(desc?: string) {
    if (!desc) return false;
    return /(^|\n)\s*[-•*]\s+/m.test(desc);
  }

  // Keep only activities that include bullet points in their description.
  const withBullets = randomActivities.filter((a) => hasBullets(a.description));

  // Limit to 5 items for the hero; if not enough, fall back to whatever we have.
  const heroActivities = withBullets.slice(0, 5);

  if (!heroActivities || heroActivities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center">No activities found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <HeroBanner activities={heroActivities} />
      <CountriesSection />
    </main>
	);
}
