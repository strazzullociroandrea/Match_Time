"use client";
import {useEffect, useState} from "react";
import type {MatchSchema} from "@/types/match-schema";
import {Navbar} from "@/components/navbar";
import {Hero} from "@/components/hero";
import {Card} from "@/components/ui/card.tsx";
import {Badge} from '@/components/ui/badge';
import {AlertCircle, CalendarDays, Clock, Code2, Info} from "lucide-react";
import {Match} from "@/components/match.tsx";
import {Spinner} from "@/components/ui/spinner"

export const PageManager = () => {
    const [matches, setMatches] = useState<MatchSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    const fetchMatches = async () => {
        try {
            const response = await fetch("/api/matches", {
                cache: "no-store",
                headers: {Accept: "application/json"},
            });

            if (!response.ok) {
                throw new Error(`Matches API returned HTTP ${response.status}`);
            }

            const data = await response.json();
            setMatches(data.matches || []);
            setLastUpdate(data.lastUpdate || new Date().toLocaleTimeString());
            setError(null);
        } catch (err: any) {
            console.error("[ERROR-REFRESH] Unable to fetch matches:", err);
            setError(err.message || "Errore di caricamento");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches().then(() => console.log("[INFO-REFRESH] Matches fetched successfully."));

        const interval = setInterval(fetchMatches, 600000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <Hero />
                <main className="container mx-auto -mt-24 p-5 relative z-10 flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="group relative flex items-center gap-4 rounded-2xl bg-card p-6 border border-border/80 shadow-sm animate-pulse w-full">

                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                <Spinner className="w-6 h-6 animate-spin" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col gap-1 text-left">
                                <h3 className="text-sm font-bold text-foreground tracking-tight">
                                    Caricamento in corso
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Stiamo recuperando le ultime informazioni sulle partite...
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const firstMatchNear = matches.find(match => match.status === "Prossima") || matches[0];
    const undefinedMatchesCount = matches.filter(m => !m.date || !m.hour).length;

    const dividedPerMonth: Record<string, MatchSchema[]> = {};

    matches.forEach((match: MatchSchema) => {
        if (!match.date) return;
        const [dd, mm, yyyy] = match.date.split('/');
        const date = new Date(Number(yyyy), Number(mm) - 1, 1);
        let month = date.toLocaleString('it-IT', {month: 'long', year: 'numeric'});

        if (!dividedPerMonth[month]) {
            dividedPerMonth[month] = [];
        }

        dividedPerMonth[month].push(match);
    });

    return (
        <>
            <Navbar/>
            <Hero/>

            {error ? (
                <div className="container mx-auto -mt-24 p-5 relative z-10">
                    <Card
                        className="group relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 rounded-2xl bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-red-500/30 border-border/80 w-full overflow-hidden shadow-sm">
                        <div className="flex items-start sm:items-center gap-4 w-full min-w-0">
                            <div
                                className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 border border-red-500/20 mt-0.5 sm:mt-0">
                                <AlertCircle className="w-6 h-6"/>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <Badge variant="outline"
                                       className="text-[10px] sm:text-xs py-0.5 px-2.5 font-semibold rounded-full border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 w-fit">
                                    Attenzione
                                </Badge>
                                <div className="space-y-1 text-foreground">{error}</div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : matches.length === 0 ? (
                <div className="container mx-auto -mt-24 p-5 relative z-10">
                    <Card
                        className="group relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 rounded-2xl bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-red-500/30 border-border/80 w-full overflow-hidden shadow-sm">
                        <div className="flex items-start sm:items-center gap-4 w-full min-w-0">
                            <div
                                className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0 border border-red-500/20 mt-0.5 sm:mt-0">
                                <AlertCircle className="w-6 h-6"/>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <Badge variant="outline"
                                       className="text-[10px] sm:text-xs py-0.5 px-2.5 font-semibold rounded-full border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 w-fit">
                                    Attenzione
                                </Badge>
                                <div className="space-y-1">
                                    <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-relaxed">
                                        Al momento non risultano partite programmate per questa stagione sportiva.
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                                        Se credi si tratti di un errore, contatta la segreteria comunicando il
                                        codice <span className="font-bold text-foreground font-mono">00D1</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <>
                    {firstMatchNear && (
                        <div className="container mx-auto -mt-24 p-5 relative z-10">
                            <Match match={firstMatchNear} key={firstMatchNear.id}/>
                        </div>
                    )}
                    <div className="container mx-auto p-5 mt-8 mb-12">
                        <div
                            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-border/60 pb-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-black tracking-tight text-foreground">Calendario Partite</h1>

                                <div className="flex items-center gap-2 lg:hidden">
                                    {undefinedMatchesCount > 0 && (
                                        <span
                                            className="text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5"/>
                                            {undefinedMatchesCount} {undefinedMatchesCount === 1 ? 'da definire' : 'da definire'}
                                    </span>
                                    )}
                                    <span
                                        className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                                    {matches.length} {matches.length === 1 ? 'Partita' : 'Partite'}
                                </span>
                                </div>
                            </div>

                            {Object.keys(dividedPerMonth).length > 0 && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                                    <span
                                        className="text-xs font-semibold text-muted-foreground shrink-0 mr-1">Vai a:</span>
                                    {Object.keys(dividedPerMonth).map(month => (
                                        <a
                                            key={`nav-${month}`}
                                            href={`#${month}`}
                                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all shrink-0 shadow-xs"
                                        >
                                            {month.charAt(0).toUpperCase() + month.slice(1)}
                                        </a>
                                    ))}
                                </div>
                            )}

                            <div className="hidden lg:flex items-center gap-2 shrink-0">
                                {undefinedMatchesCount > 0 && (
                                    <span
                                        className="text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                                    <AlertCircle className="w-3.5 h-3.5"/>
                                        {undefinedMatchesCount} {undefinedMatchesCount === 1 ? 'partita da definire' : 'partite da definire'}
                                </span>
                                )}
                                <span
                                    className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full shadow-xs">
                                {matches.length} {matches.length === 1 ? 'Partita' : 'Partite'} totali
                            </span>
                            </div>
                        </div>

                        {matches.length === 0 ? (
                            <div
                                className="text-center py-12 rounded-2xl border border-dashed border-border p-6 bg-card/50">
                                <p className="text-sm text-muted-foreground">Nessuna partita in calendario.</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {Object.keys(dividedPerMonth).map(month => (
                                    <div key={month} id={month} className="space-y-4 scroll-mt-24">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-black text-xs uppercase tracking-widest shadow-xs">
                                                <CalendarDays className="w-4 h-4"/>
                                                {month}
                                            </div>
                                        </div>

                                        <div className="space-y-3.5">
                                            {dividedPerMonth[month].map((match, index) => (
                                                <Match match={match} key={match.id || index}/>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <footer className="border-t border-border/60 bg-card/30 mt-20 pt-10 pb-8">
                        <div className="container mx-auto px-5 flex flex-col gap-6 text-xs text-muted-foreground">

                            <div
                                className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/60 max-w-5xl mx-auto">
                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5"/>
                                <p className="leading-relaxed text-left">
                                    Progetto indipendente. Tutti i dati visualizzati sono di proprietà del comitato
                                    <span className="font-semibold text-foreground"> PGS Milano</span> e sono resi
                                    disponibili al pubblico
                                    dagli stessi tramite il loro sito web.
                                    L'applicazione si limita a facilitarne la consultazione. L'autore non è responsabile
                                    di eventuali
                                    inesattezze o discrepanze nei dati mostrati.
                                </p>
                            </div>

                            <div
                                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-center sm:text-left">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-primary"/>
                                    <span>Ultimo aggiornamento partite: <span
                                        className="font-semibold text-foreground"> {lastUpdate}</span></span>
                                </div>

                                <div className="flex items-center gap-1.5 font-medium">
                                    <Code2 className="w-3.5 h-3.5 text-primary"/>
                                    <span>
                        Sviluppato da <a
                                        href="https://cirostrazzullo.it"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
                                    >
                            Ciro A. Strazzullo
                        </a>
                    </span>
                                </div>
                            </div>

                        </div>
                    </footer>
                </>
            )}
        </>
    );
};