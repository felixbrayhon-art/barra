import * as React from 'react';
import { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileEditorProps {
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
}

const AVATARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave }) => {
    const [name, setName] = useState(profile.name);
    const [avatar, setAvatar] = useState(profile.avatar);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ name: name.trim(), avatar });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div style={{
            height: '100%', overflow: 'auto', background: '#f0f2f5', padding: '48px 64px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Perfil</h1>
            <p style={{ fontSize: 13, color: '#8b92a5', marginBottom: 48, fontWeight: 500 }}>Edite suas informações pessoais</p>

            {/* Avatar */}
            <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8b92a5', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Avatar</p>
                <div style={{ display: 'flex', gap: 12 }}>
                    {AVATARS.map(a => (
                        <button key={a} onClick={() => setAvatar(a)}
                            style={{
                                width: 56, height: 56, borderRadius: '50%',
                                background: avatar === a ? '#000' : '#fafafa',
                                color: avatar === a ? '#fff' : '#aaa',
                                border: avatar === a ? 'none' : '1px solid #eee',
                                cursor: 'pointer', fontSize: 18, fontWeight: 800,
                                transition: 'all 0.2s ease',
                                fontFamily: "'Inter', sans-serif"
                            }}>
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8b92a5', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Nome</p>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    style={{
                        width: '100%', maxWidth: 400, padding: '14px 20px', background: '#fff',
                        border: '1px solid #e0e3ea', borderRadius: 12, fontSize: 16, fontWeight: 600,
                        outline: 'none', fontFamily: "'Inter', sans-serif"
                    }}
                />
            </div>

            {/* Save */}
            <button onClick={handleSave} disabled={!name.trim()}
                style={{
                    padding: '14px 40px', background: name.trim() ? '#000' : '#e5e5e5',
                    color: name.trim() ? '#fff' : '#aaa', border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 800, cursor: name.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
                }}>
                {saved ? '✓ Salvo!' : 'Salvar alterações'}
            </button>
        </div>
    );
};
