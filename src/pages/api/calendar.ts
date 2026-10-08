import type {APIRoute} from 'astro';
import * as ics from "ics";
import type {MatchSchema} from "../../types/match-schema";

export const runtime = "edge";


export const GET: APIRoute = async ({params, locals}) => {

    try {
        const url = import.meta.env.PUBLIC_URL_API;
        const category = import.meta.env.PUBLIC_CATEGORY;
        const team = import.meta.env.PUBLIC_TEAM;

        if (!url || !category || !team) {
            console.error("[ERROR-ICS] Missing data env");
            return new Response("Missing data env.", {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                category: category,
                team: team
            })
        })

        const res = await response.json();

        const {matches} = res;


        const validMatches = matches.filter((m: MatchSchema) => m.date && m.hour && m.id && m.home && m.guest && m.place && m.category)

        const events: ics.EventAttributes[] = validMatches.map((match: MatchSchema) => {
            const [day, month, yearRaw] = match.date.split("/").map(Number);
            const [hour, minute] = match.hour.split(":").map(Number);

            const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;


            const alarms = [];

            alarms.push({
                action: "display" as const,
                description: "Match Time: Hai una partita tra una settimana!",
                trigger: {hours: 168, before: true},
            });

            alarms.push({
                action: "display" as const,
                description: "Match Time: Hai una partita tra tre giorni!",
                trigger: {hours: 72, before: true},
            });

            return {
                uid: `${match.home}-${match.guest}-${match.hour}`
                    .replace(/\s+/g, "")
                    .toLowerCase(),
                startInputType: "local",
                startOutputType: "local",
                start: [year!, month!, day!, hour!, minute!],
                duration: {hours: 2, minutes: 0},
                title: `Partita ${import.meta.env.PUBLIC_CATEGORY}`,
                description: `Partita ${match.category}: ${match.home} vs ${match.guest}.\n\n` +
                    `Ricordati di arrivare almeno un'ora prima dell'inizio. ` +
                    `Non dimenticare di portare con te un documento d'identità valido.`,
                location: match.place || "Sede da definire",
                categories: ["Partita di Pallavolo"],
                status: "CONFIRMED",
                busyStatus: "BUSY",
                alarms: alarms,
            };
        })

        const {error, value} = ics.createEvents(events);

        if (error) {
            console.error("[ERROR-ICS] Error creating calendar:", error);
            return new Response("Error creating calendar:" + error, {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        return new Response(value, {
            status: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": 'inline; filename="partite.ics"',
            },
        });
    } catch (e) {
        console.error("[ERROR-ICS] Unexpected error:", e);
        return new Response("Unexpected error: " + e, {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}