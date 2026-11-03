// Anonymous usage counter for Change is Good Food Finder.
// The page sends POST /api/count?e=visit or ?e=search. We add 1 to today's total and store nothing else:
// no IP address, no zip code, no location, no cookies.
// To see the numbers: Netlify > this project > Blobs (store "usage"), one entry per day.
import { getStore } from "@netlify/blobs";

const EVENTS = ["visit", "search"];

export default async (req) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const event = new URL(req.url).searchParams.get("e");
  if (!EVENTS.includes(event)) return new Response(null, { status: 400 });

  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver" }).format(new Date());
  const store = getStore("usage");
  const counts = (await store.get(day, { type: "json" })) || { visit: 0, search: 0 };
  counts[event] = (counts[event] || 0) + 1;
  await store.setJSON(day, counts);
  return new Response(null, { status: 204 });
};

export const config = { path: "/api/count" };
