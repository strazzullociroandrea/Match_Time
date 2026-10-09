export const Hero = ()=>{
    return (

        <div
            className="w-full h-100 sm:h-100 bg-linear-to-b from-[#040811] via-[#040811] to-[#260508] text-white pt-28 relative">
            <div className="max-w-7xl mx-auto px-6 md:px-10">

                <div
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-900/50 bg-red-950/30 text-red-500 text-xs font-semibold tracking-wider uppercase mb-6">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    Campionato PGS
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-3">
                    Under 15 <span className="text-red-600">Maschile</span>
                </h1>
                <p className="text-white/60 text-sm md:text-base mb-8">
                    Calendario partite Under 15 Maschile.
                </p>

            </div>
        </div>
    )
}