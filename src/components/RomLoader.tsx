import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface RomLoaderProps {
    onRomLoaded: (romData: Uint8Array) => void;
}

export const RomLoader: React.FC<RomLoaderProps> = ({ onRomLoaded }) => {
    const [showModal, setShowModal] = useState(false);
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target?.result;
                if (buffer instanceof ArrayBuffer) {
                    onRomLoaded(new Uint8Array(buffer));
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const processUrl = (inputUrl: string): string => {
        // Smart fix for GitHub URLs to avoid CORS/Redirect issues
        // Converts https://github.com/user/repo/raw/branch/file.nes 
        // to https://raw.githubusercontent.com/user/repo/branch/file.nes
        try {
            const urlObj = new URL(inputUrl);
            if (urlObj.hostname === 'github.com') {
                // Replace /blob/ or /raw/ with nothing (raw.githubusercontent structure is different)
                // github.com/user/repo/raw/main/file -> raw.githubusercontent.com/user/repo/main/file
                // github.com/user/repo/blob/main/file -> raw.githubusercontent.com/user/repo/main/file
                if (urlObj.pathname.includes('/raw/') || urlObj.pathname.includes('/blob/')) {
                    urlObj.hostname = 'raw.githubusercontent.com';
                    urlObj.pathname = urlObj.pathname.replace('/raw/', '/').replace('/blob/', '/');
                    return urlObj.toString();
                }
            }
        } catch (e) {
            // Invalid URL, let fetch handle it
        }
        return inputUrl;
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        setError(null);

        const finalUrl = processUrl(url);
        console.log(`Loading ROM from: ${finalUrl}`);

        try {
            const response = await fetch(finalUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch ROM: ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            onRomLoaded(new Uint8Array(buffer));
            setUrl('');
            setShowModal(false);
        } catch (err) {
            console.error("Error loading ROM from URL:", err);
            setError(err instanceof Error ? err.message : "Failed to load ROM");
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                backgroundColor: '#222',
                padding: '30px 40px',
                borderRadius: '12px',
                width: '800px',
                maxWidth: '90vw',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                textAlign: 'left',
                border: '1px solid #444',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>Load ROM from URL</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#aaa',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '0 5px'
                        }}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/game.nes"
                            autoFocus
                            style={{
                                flex: 1,
                                padding: '15px',
                                borderRadius: '6px',
                                border: '1px solid #555',
                                backgroundColor: '#333',
                                color: 'white',
                                fontSize: '18px',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            style={{
                                padding: '15px 30px',
                                backgroundColor: '#e60012',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isLoading ? 'wait' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                minWidth: '100px'
                            }}
                        >
                            {isLoading ? 'Loading...' : 'Load Game'}
                        </button>
                    </div>
                    {error && <p style={{ color: '#ff6b6b', fontSize: '14px', margin: 0 }}>{error}</p>}
                </form>
            </div>
        </div>
    );

    const commonButtonStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 16px',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        width: '150px',
        boxSizing: 'border-box',
        border: 'none',
        height: '36px', // Fixed height for consistency
        lineHeight: '1',
        fontFamily: 'inherit'
    };

    return (
        <div className="rom-loader" style={{
            textAlign: 'center',
            margin: '0',
            padding: '10px',
            // Keep design consistent
        }}>
            <h2 style={{ marginBottom: '15px', color: '#fff', fontSize: '1.5em', margin: '0 0 15px 0' }}>Load Game</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <label
                    htmlFor="rom-upload"
                    className="button"
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: '#e60012',
                    }}
                >
                    Upload .nes File
                </label>
                <input
                    id="rom-upload"
                    type="file"
                    accept=".nes"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        ...commonButtonStyle,
                        backgroundColor: '#444',
                    }}
                >
                    Load from URL
                </button>
            </div>

            {showModal && createPortal(modalContent, document.body)}
        </div>
    );
};
