export const Navbar = () => {
    return (
        <nav
            id="main-nav"
            className="h-20 w-full fixed top-0 left-0 right-0 z-50 bg-[#040811] border-b border-white/5 flex items-center shadow-xl"
        >
            <div className="max-w-7xl w-full mx-auto px-6 md:px-10 flex justify-between items-center">

                <a href="/" className="flex items-center gap-4 group">
                    <img src="/logo.png" alt="Logo Black Bulls Volley"
                         className="h-10 w-auto object-contain"/>

                    <div className="flex flex-col">
                        <div className="flex items-center font-bold text-sm tracking-wide">
                            <span className="text-white uppercase">Match</span>
                            <span className="text-red-600 uppercase">Time</span>
                        </div>
                        <div className="flex items-center font-bold text-[9px] tracking-wide">
                            <span className="text-white/60 uppercase">Under 15 Maschile</span>
                        </div>
                    </div>
                </a>

                <div className="flex items-center">
                    <a href="https://volley.pgsmilano.org/calendari" target="_blank" rel="noopener noreferrer"
                       className="text-white/70 hover:text-white text-sm font-medium flex items-center gap-2.5 transition-colors duration-300">
                        <span>Sito ufficiale</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    )
}