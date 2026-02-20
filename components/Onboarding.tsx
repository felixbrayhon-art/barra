import * as React from 'react';
import { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
}

const AVATARS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('A');

    const handleSubmit = () => {
        if (!name.trim()) return;
        onComplete({ name: name.trim(), avatar });
    };

    return (
        <div style={{
            height: '100vh', background: '#000', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ width: 400, textAlign: 'center' }}>
                <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -2, marginBottom: 8 }}>
                    MEU BULLET
                </h1>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 48 }}>
                    Como devemos te chamar?
                </p>

                {/* Avatar Selection */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
                    {AVATARS.map(a => (
                        <button
                            key={a}
                            onClick={() => setAvatar(a)}
                            style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: avatar === a ? '#fff' : '#222',
                                color: avatar === a ? '#000' : '#555',
                                border: 'none', cursor: 'pointer',
                                fontSize: 16, fontWeight: 800,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {a}
                        </button>
                    ))}
                </div>

                {/* Name Input */}
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Seu nome..."
                    style={{
                        width: '100%', padding: '16px 24px', background: '#111', color: '#fff',
                        border: '1px solid #333', borderRadius: 12, fontSize: 16, outline: 'none',
                        textAlign: 'center', fontWeight: 600, marginBottom: 24,
                        fontFamily: "'Inter', sans-serif"
                    }}
                    autoFocus
                />

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    style={{
                        width: '100%', padding: '16px', background: name.trim() ? '#fff' : '#333',
                        color: name.trim() ? '#000' : '#666', border: 'none', borderRadius: 12,
                        fontSize: 15, fontWeight: 800, cursor: name.trim() ? 'pointer' : 'default',
                        transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif"
                    }}
                >
                    Começar →
                </button>
            </div>
        </div>
    );
};
