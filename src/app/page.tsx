"use server";

import Image from "next/image";
import { db } from "../../db/client";
import { activities } from "../../db/schema";
import { sql } from "drizzle-orm";

export default async function Home() {
	const [activity] = await db
		.select()
		.from(activities)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (!activity) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-center">No activities found.</p>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
			style={{ backgroundImage: `url(${activity.imageUrl})` }}
		>
			<div className="backdrop-brightness-50 bg-black/30 w-full h-full flex items-center justify-center">
				<div className="max-w-3xl p-8 text-center text-white">
					<h1 className="text-4xl font-bold mb-4">{activity.name}</h1>
					<p className="text-xl mb-6">
						{activity.price && activity.currency ? (
							<span>
								{activity.price} {activity.currency}
							</span>
						) : (
							<span>Free</span>
						)}
					</p>
					<div className="flex items-center justify-center">
						<Image
							src={activity.imageUrl}
							alt={activity.name}
							width={800}
							height={450}
							className="rounded shadow-lg hidden sm:block"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
