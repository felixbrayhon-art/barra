import * as React from 'react';
import { useState, useEffect } from 'react';

export const SplashScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + Math.random() * 20, 100));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#000', fontFamily: "'Inter', sans-serif"
        }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>
                MEU BULLET
            </h1>
            <div style={{ width: 120, height: 2, background: '#111', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', background: '#fff',
                    width: `${progress}%`, transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};
