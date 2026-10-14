import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {MapPin, ChevronRight, Calendar, Clock, Check, Copy} from "lucide-react";
import {getNavigationLink} from "@/lib/get-navigation-link.ts";
import type {MatchSchema} from "@/types/match-schema.ts";
import {useState} from "react";

export const Match = ({match}: { match: MatchSchema }) => {

    const [copied, setCopied] = useState(false);

    const isConcluso = match.status === "Conclusa";

    const handleCopyAddress = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!match.place) return;

        try {
            await navigator.clipboard.writeText(match.place);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Impossibile copiare l'indirizzo:", err);
        }
    };

    const statusColors: Record<string, string> = {
        "In programma": "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
        "Prossima": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
        "Disputata": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
        "Conclusa": "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
        "Non definita": "bg-muted text-muted-foreground border-border",
    };

    return (
        <Card
            key={`${match.id}-calendar`}
            className={`group relative flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-6 rounded-2xl bg-card p-4 sm:p-5 transition-all duration-300 border-border/80 w-full overflow-hidden ${
                isConcluso
                    ? "opacity-75 bg-muted/20 hover:opacity-90"
                    : "hover:shadow-lg hover:border-primary/40"
            }`}
        >
            <div
                className={`flex md:flex-col items-center justify-between md:justify-center border rounded-xl p-3 md:py-3 md:px-4 shrink-0 md:w-36 gap-2 ${
                    isConcluso
                        ? "bg-muted/20 border-border/40 text-muted-foreground"
                        : "bg-muted/40 md:bg-primary/3 border-border/60 md:border-primary/10"
                }`}>
                <div className="flex items-center gap-1.5 md:flex-col md:gap-0.5 text-center">
                    <Clock
                        className={`w-3.5 h-3.5 md:hidden ${isConcluso ? "text-muted-foreground" : "text-primary"}`}/>
                    <span
                        className={`text-xl md:text-2xl font-black tracking-tight leading-none ${
                            isConcluso ? "text-muted-foreground" : "text-foreground md:text-primary"
                        }`}>
                        {match.hour ?? "--:--"}
                    </span>
                </div>
                <div className="h-3 w-px bg-border md:hidden"></div>
                <div className="flex items-center gap-1.5 md:flex-col text-center">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground md:hidden"/>
                    <span
                        className="text-xs md:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {match.date ?? "Non disponibile"}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-start">
                        <Badge
                            variant="outline"
                            className={`text-[10px] sm:text-xs py-0.5 px-2.5 font-semibold rounded-full border ${statusColors[match.status] || statusColors["Non definita"]}`}
                        >
                            {match.status}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-4 w-full pt-1">
                        <span
                            className={`text-sm sm:text-base font-extrabold truncate text-left flex-1 ${isConcluso ? "text-muted-foreground" : "text-foreground"}`}>
                            {match.home}
                        </span>

                        <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0 border ${
                                isConcluso
                                    ? "bg-muted text-muted-foreground border-border"
                                    : "bg-primary/10 text-primary border-primary/20"
                            }`}>
                            VS
                        </span>

                        <span
                            className={`text-sm sm:text-base font-extrabold truncate text-right flex-1 ${isConcluso ? "text-muted-foreground" : "text-foreground"}`}>
                            {match.guest}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground/90 pt-1 border-t border-border/40">
                    <MapPin className={`w-4 h-4 shrink-0 ${isConcluso ? "text-muted-foreground" : "text-primary"}`}/>
                    <span className="text-xs font-medium truncate leading-relaxed">
                        {match.place ?? "Indirizzo non disponibile"}
                    </span>
                </div>
            </div>

            <div
                className="flex items-center justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:pl-2 shrink-0">
                <button
                    type="button"
                    onClick={handleCopyAddress}
                    disabled={!match.place || isConcluso}
                    title="Copia indirizzo"
                    className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
                        match.place && !isConcluso
                            ? "cursor-pointer  bg-secondary/60 text-secondary-foreground hover:bg-secondary font-semibold shadow-xs"
                            : "bg-secondary/30 text-muted-foreground/40 cursor-not-allowed opacity-50"
                    }`}
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-600"/> : <Copy className="w-4 h-4"/>}
                </button>

                <a
                    href={!match.place || isConcluso ? undefined : getNavigationLink(match.place)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!match.place || isConcluso}
                    className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        match.place && !isConcluso
                            ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm hover:shadow"
                            : "bg-secondary/50 text-muted-foreground/60 cursor-not-allowed opacity-50 font-medium"
                    }`}
                >
                    <span className="text-xs">Apri Navigatore</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5"/>
                </a>
            </div>
        </Card>
    )
}