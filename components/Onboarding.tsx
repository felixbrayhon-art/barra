import * as React from 'react';
import { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
}

const AVATARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(AVATARS[0]);

    const handleStart = () => {
        if (!name.trim()) return;
        onComplete({ name: name.trim(), avatar });
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: 400, padding: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Olá.</h1>
                <p style={{ fontSize: 14, color: '#666', marginBottom: 48, fontWeight: 500 }}>Como devemos chamar você hoje?</p>

                <div style={{ marginBottom: 32 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Avatar</p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {AVATARS.map(a => (
                            <button key={a} onClick={() => setAvatar(a)}
                                style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: avatar === a ? '#fff' : 'transparent',
                                    color: avatar === a ? '#000' : '#444',
                                    border: avatar === a ? 'none' : '1px solid #222',
                                    cursor: 'pointer', fontSize: 14, fontWeight: 800,
                                    transition: 'all 0.2s'
                                }}>
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 48 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Nome</p>
                    <input
                        value={name}
                        autoFocus
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleStart()}
                        placeholder="Seu nome..."
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            borderBottom: '2px solid #222', padding: '12px 0', fontSize: 24,
                            fontWeight: 700, color: '#fff', outline: 'none'
                        }}
                    />
                </div>

                <button onClick={handleStart} disabled={!name.trim()}
                    style={{
                        width: '100%', padding: '16px', background: name.trim() ? '#fff' : '#111',
                        color: name.trim() ? '#000' : '#444', border: 'none', borderRadius: 12,
                        fontSize: 15, fontWeight: 800, cursor: name.trim() ? 'pointer' : 'default',
                        transition: 'all 0.2s'
                    }}>
                    Começar →
                </button>
            </div>
        </div>
    );
};
