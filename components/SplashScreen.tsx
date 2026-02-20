import * as React from 'react';
import { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + Math.random() * 30, 100));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#000', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', sans-serif", zIndex: 50
        }}>
            {/* Logo */}
            <div style={{ marginBottom: 48, textAlign: 'center' }}>
                <h1 style={{ fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: -3, margin: 0 }}>
                    MEU BULLET
                </h1>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#666', letterSpacing: 6, textTransform: 'uppercase', marginTop: 12 }}>
                    Organização pessoal
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: 200, height: 2, background: '#333', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{
                    width: `${progress}%`, height: '100%', background: '#fff',
                    transition: 'width 0.3s ease-out'
                }} />
            </div>
        </div>
    );
};
