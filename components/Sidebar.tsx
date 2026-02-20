
import * as React from 'react';
import { useState } from 'react';
import { Source, Folder, SavedItem, AppTab, UserProfile } from '../types';
import { generateProjectContent } from '../services/geminiService';

interface SidebarProps {
    userProfile: UserProfile;
    sources: Source[];
    folders: Folder[];
    savedItems: SavedItem[];
    onAddSource: (source: Source) => void;
    onRemoveSource: (id: string) => void;
    onResetApp: () => void;
    onCreateFolder: (name: string) => string;
    onLoadItem: (item: SavedItem) => void;
    onDeleteItem: (id: string) => void;
    onDeleteFolder: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    userProfile,
    sources,
    folders,
    savedItems,
    onAddSource,
    onRemoveSource,
    onResetApp,
    onCreateFolder,
    onLoadItem,
    onDeleteItem,
    onDeleteFolder,
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!projectName.trim()) return;
        setIsLoading(true);
        try {
            const content = await generateProjectContent(projectName);
            const newSource: Source = {
                id: crypto.randomUUID(),
                title: projectName,
                content,
                type: 'text',
                createdAt: Date.now(),
            };
            onAddSource(newSource);
            setProjectName('');
            setIsCreating(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            width: 280, background: '#000', color: '#fff', display: 'flex',
            flexDirection: 'column', height: '100%', flexShrink: 0,
            borderRight: '1px solid #222', fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ padding: '32px 24px 16px' }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, margin: 0 }}>
                    MEU <span style={{ color: '#999' }}>BULLET</span>
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, paddingBottom: 16, borderBottom: '1px solid #222' }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#222',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700
                    }}>
                        {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#aaa' }}>{userProfile.name}</span>
                </div>
            </div>

            {/* New Project */}
            <div style={{ padding: '0 24px', marginBottom: 16 }}>
                {!isCreating ? (
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            width: '100%', padding: '10px 16px', background: '#fff', color: '#000',
                            border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13,
                            cursor: 'pointer', transition: 'opacity 0.2s'
                        }}
                        onMouseOver={e => (e.currentTarget.style.opacity = '0.8')}
                        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                    >
                        + Novo Projeto
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            placeholder="Nome do projeto..."
                            style={{
                                padding: '8px 12px', background: '#111', color: '#fff',
                                border: '1px solid #333', borderRadius: 8, fontSize: 13, outline: 'none'
                            }}
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button
                                onClick={handleCreate}
                                disabled={isLoading}
                                style={{
                                    flex: 1, padding: '8px', background: '#fff', color: '#000',
                                    border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12,
                                    cursor: 'pointer', opacity: isLoading ? 0.5 : 1
                                }}
                            >
                                {isLoading ? '...' : 'Criar'}
                            </button>
                            <button
                                onClick={() => { setIsCreating(false); setProjectName(''); }}
                                style={{
                                    padding: '8px 12px', background: '#222', color: '#888',
                                    border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Projects List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                    Projetos ({sources.length})
                </p>
                {sources.length === 0 && (
                    <p style={{ fontSize: 12, color: '#444', fontStyle: 'italic' }}>Nenhum projeto ainda.</p>
                )}
                {sources.map(s => (
                    <div key={s.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                        background: '#111', cursor: 'default'
                    }}>
                        <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                            {s.title}
                        </span>
                        <button
                            onClick={() => onRemoveSource(s.id)}
                            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #222' }}>
                <button
                    onClick={onResetApp}
                    style={{
                        width: '100%', padding: '8px', background: 'transparent', color: '#555',
                        border: '1px solid #333', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Redefinir App
                </button>
            </div>
        </div>
    );
};
