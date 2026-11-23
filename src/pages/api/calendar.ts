import type { APIRoute } from 'astro';
import * as ics from "ics";
import type { MatchSchema } from "@/types/match-schema.ts";

export const runtime = "edge";

export const GET: APIRoute = async () => {
    try {
        const url = import.meta.env.PUBLIC_URL_API;
        const category = import.meta.env.PUBLIC_CATEGORY;
        const team = import.meta.env.PUBLIC_TEAM;

        if (!url || !category || !team) {
            console.error("[ERROR-ICS] Missing data env");
            return new Response(JSON.stringify({ error: "Missing data env." }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            });
        }

        const response = await fetch(url, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify({
                category: category,
                team: team
            })
        });

        if (!response.ok) {
            console.error("[ERROR-ICS] API error status:", response.status);
            return new Response(JSON.stringify({ error: `API error: ${response.status}` }), {
                status: 502,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            });
        }

        const res = await response.json();
        const matches: MatchSchema[] = Array.isArray(res?.matches) ? res.matches : [];

        const validMatches = matches.filter((m: MatchSchema) =>
            m.date &&
            m.hour &&
            m.date !== "Da definire" &&
            m.hour !== "Da definire" &&
            m.id &&
            m.home &&
            m.guest &&
            m.place &&
            m.category
        );

        const events: ics.EventAttributes[] = validMatches.map((match: MatchSchema) => {
            const [day, month, yearRaw] = match.date.split("/").map(Number);
            const [hour, minute] = match.hour.split(":").map(Number);
            const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;

            return {
                uid: `${match.home}-${match.guest}-${match.date}-${match.hour}`
                    .replace(/\s+/g, "")
                    .toLowerCase(),
                startInputType: "local",
                startOutputType: "local",
                start: [year!, month!, day!, hour!, minute!],
                duration: { hours: 2, minutes: 0 },
                title: `Partita ${category}`,
                description:
                    `Partita ${match.category}: ${match.home} vs ${match.guest}.\n\n` +
                    `Ricordati di arrivare almeno un'ora prima dell'inizio. ` +
                    `Non dimenticare di portare con te un documento d'identità valido.`,
                location: match.place || "Sede da definire",
                categories: ["Partita di Pallavolo"],
                status: "CONFIRMED",
                busyStatus: "BUSY",
                alarms: [
                    {
                        action: "display" as const,
                        description: "Match Time: Hai una partita tra una settimana!",
                        trigger: { hours: 168, before: true },
                    },
                    {
                        action: "display" as const,
                        description: "Match Time: Hai una partita tra tre giorni!",
                        trigger: { hours: 72, before: true },
                    },
                ],
            };
        });

        const { error, value } = ics.createEvents(events);

        if (error) {
            console.error("[ERROR-ICS] Error creating calendar:", error);
            return new Response(JSON.stringify({ error: "Error creating calendar: " + error }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            });
        }

        return new Response(value, {
            status: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'inline; filename="partite.ics"',
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    } catch (e) {
        console.error("[ERROR-ICS] Unexpected error:", e);
        return new Response(JSON.stringify({ error: "Unexpected error: " + e }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            }
        });
    }
};