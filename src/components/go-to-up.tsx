'use client'
import {ChevronUp} from 'lucide-react'
import {useEffect, useState} from "react";


export function GoToUp() {
    const [isVisible, setIsVisible] = useState(false)

    const isPageScrolled = () => {
        return window.scrollY > 30;
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(isPageScrolled());
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`fixed bottom-10 right-7 z-50 ${isVisible ? 'block' : 'hidden'}`}>
            <button
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                aria-label="Torna a inizio pagina"
                className="text-white bg-red-500 cursor-pointer flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/90 hover:bg-brand-blue  shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
                <ChevronUp size={24} className="stroke-sm"/>
            </button>
        </div>
    )
}