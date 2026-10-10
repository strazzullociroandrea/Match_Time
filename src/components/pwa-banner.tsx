import React, {useEffect, useState} from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaBanner() {

    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);


    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        if (isIosDevice && !isStandalone) {
            const timer = setTimeout(() => setShowBanner(true), 2000);
            setIsIOS(true);
            return () => clearTimeout(timer);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setShowBanner(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const {outcome} = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    if (!showBanner) return null;


    return (
        <div
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl border border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xl">
                    🏐
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Installa MatchTime</h3>
                    <p className="text-xs text-gray-500">
                        {isIOS
                            ? "Tocca il tasto Condividi (quadro con freccia) e poi 'Aggiungi alla schermata Home'."
                            : "Accedi al calendario partite più velocemente e usala offline."}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {!isIOS && deferredPrompt && (
                    <button
                        onClick={handleInstallClick}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                        Installa
                    </button>
                )}
                <button
                    onClick={() => setShowBanner(false)}
                    className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label="Chiudi"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}