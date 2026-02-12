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
                            style={{ color: isCopied ? '#4ade80' : 'inherit' }}
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
                <div className="trust-badges">
                    <div className="badge" title="Encrypted Connection">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span>SSL Secured</span>
                    </div>
                    <div className="badge" title="Auditable Code">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        <span>Open Source</span>
                    </div>
                    <div className="badge" title="No Database">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        <span>Zero-Knowledge</span>
                    </div>
                    <div className="badge" title="VirusTotal Clean">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span>Malware-Free</span>
                    </div>
                </div>

                <div className="security-note">
                    <button className="link-btn" onClick={() => document.getElementById('security-modal').showModal()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Why is this safe?
                    </button>
                    <span className="separator">•</span>
                    <span>Google Safe Browsing Verified Site</span>
                </div>
            </footer>

            <dialog id="security-modal" className="modal" onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                if (rect.left > e.clientX || rect.right < e.clientX || rect.top > e.clientY || rect.bottom < e.clientY) {
                    e.target.close();
                }
            }}>
                <div className="modal-content">
                    <header>
                        <h2>🛡️ Security Architecture</h2>
                        <button className="close-btn" onClick={() => document.getElementById('security-modal').close()}>&times;</button>
                    </header>
                    <div className="modal-body">
                        <div className="security-item">
                            <h3>🎲 Entropy Pool</h3>
                            <p>We generate a chaotic pool of 64 characters (symbols + alphanumeric) using <code>crypto.getRandomValues</code>, then extract your unique sequence from it. No patterns, just noise.</p>
                        </div>
                        <div className="security-item">
                            <h3>⚡ System-Level Randomness</h3>
                            <p>We rely on your device's hardware RNG (Random Number Generator). This is the same standard used for banking encryption.</p>
                        </div>
                        <div className="security-item">
                            <h3>🧠 Zero Persistence</h3>
                            <p>This app has no memory. No database. No local storage. No cookies. As soon as you close this tab, the data evaporates from your RAM forever.</p>
                        </div>
                    </div>
                    <form method="dialog">
                        <button className="primary-btn">Got it</button>
                    </form>
                </div>
            </dialog>
        </div>
    );
}

export default App;
