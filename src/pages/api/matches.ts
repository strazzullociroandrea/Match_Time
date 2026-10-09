import type {APIRoute} from "astro";

export const runtime = "edge";

export const GET: APIRoute = async () => {
    const url = import.meta.env.PUBLIC_URL_API;
    const category = import.meta.env.PUBLIC_CATEGORY;
    const team = import.meta.env.PUBLIC_TEAM;

    if (!url || !category || !team) {
        console.error("[ERROR-MATCHES] Missing data env");
        return new Response(JSON.stringify({error: "Missing data env."}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({category, team}),
        });

        if (!response.ok) {
            throw new Error(`Upstream API returned HTTP ${response.status}`);
        }

        return new Response(await response.text(), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    } catch (error) {
        console.error("[ERROR-MATCHES] Unable to load matches:", error);
        return new Response(JSON.stringify({error: "Unable to load matches."}), {
            status: 502,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });
    }
};
