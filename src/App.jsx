import React, { useState, useCallback } from 'react';

// Character Pools
const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Secure Random Generator Helpers
const getRandomChar = (pool) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return pool[array[0] % pool.length];
};

const getRandomInt = (min, max) => {
    const range = max - min + 1;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return min + (array[0] % range);
};

function App() {
    const [noise, setNoise] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const generateNoise = useCallback(() => {
        // 1. Generate 64-char base (70% special, 30% alpha)
        const length = 64;
        const specialCount = Math.floor(length * 0.7);
        const alphaCount = length - specialCount;

        let chars = [];
        for (let i = 0; i < specialCount; i++) chars.push(getRandomChar(SPECIAL));
        for (let i = 0; i < alphaCount; i++) chars.push(getRandomChar(ALPHANUMERIC));

        // Fisher-Yates Shuffle
        for (let i = chars.length - 1; i > 0; i--) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            const j = array[0] % (i + 1);
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }

        const baseNoise = chars.join('');

        // 2. Sub-selection (15-20 chars)
        const targetLength = getRandomInt(15, 20);
        const maxStartIndex = baseNoise.length - targetLength;
        const startIndex = getRandomInt(0, maxStartIndex);

        const finalNoise = baseNoise.substring(startIndex, startIndex + targetLength);

        setNoise(finalNoise);
        setIsVisible(false); // Reset visibility on new generation
        setIsCopied(false);

        // Haptic/Visual feedback
        if (navigator.vibrate) navigator.vibrate(10);
    }, []);

    const handleCopy = useCallback(async () => {
        if (!noise) return;
        try {
            await navigator.clipboard.writeText(noise);
            setIsCopied(true);
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    }, [noise]);

    return (
        <div id="app">
            <header>
                <h1>CryptoNoise Pro</h1>
                <p className="subtitle">Secure Key Generator</p>
            </header>

            <main>
                <div className={`output-container ${noise ? 'active' : ''}`}>
                    <div id="output-display" className={!isVisible || !noise ? 'privacy-mask' : ''}>
                        {noise && isVisible ? noise : '•••••'}
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => setIsVisible(!isVisible)}
                            className="icon-btn"
                            aria-label="Toggle visibility"
                            disabled={!noise}
                        >
                            {isVisible ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            )}
                        </button>

                        <button
                            onClick={handleCopy}
                            className="icon-btn"
                            aria-label="Copy to clipboard"
                            disabled={!noise}
                            style={{ color: isCopied ? 'var(--accent-color)' : 'inherit' }}
                        >
                            {isCopied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            )}
                        </button>
                    </div>
                </div>

                <button id="generate-btn" className="primary-btn" onClick={generateNoise}>
                    Generate Cryptographic Noise
                </button>
            </main>

            <footer>
                <div className="security-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>Client-side only. No data ever leaves this device.</span>
                </div>
            </footer>
        </div>
    );
}

export default App;
