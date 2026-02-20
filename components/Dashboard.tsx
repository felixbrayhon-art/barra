import * as React from 'react';
import { BulletJournalState } from '../types';

interface DashboardProps {
    state: BulletJournalState;
    userName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, userName }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).replace(/^\w/, (c) => c.toUpperCase());

    const features = [
        { key: 'futuro', title: 'Registro Futuro', desc: 'Organize compromissos e aniversários', icon: '📅' },
        { key: 'mensal', title: 'Visão Mensal', desc: 'Eventos, metas e tarefas do mês', icon: '🗓️' },
        { key: 'semanal', title: 'Registro Semanal', desc: 'Aulas, trabalho e planos sociais', icon: '🗒️' },
        { key: 'diario', title: 'Registro Diário', desc: 'Tarefas e anotações do dia', icon: '📓' },
        { key: 'colecoes', title: 'Coleções', desc: 'Livros, filmes e listas temáticas', icon: '📑' },
        { key: 'habitos', title: 'Hábitos', desc: 'Monitore seu progresso diário', icon: '📈' },
        { key: 'humor', title: 'Humor', desc: 'Registre suas emoções', icon: '😊' },
        { key: 'financas', title: 'Finanças', desc: 'Controle gastos e economias', icon: '💰' },
        { key: 'gratidao', title: 'Gratidão', desc: 'Pratique gratidão diária', icon: '❤️' },
    ];

    return (
        <div style={{
            height: '100%',
            overflow: 'auto',
            background: '#f8fafc',
            padding: '60px 80px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ marginBottom: 48 }}>
                <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                    Bem-vindo
                </h1>
                <p style={{ fontSize: 16, color: '#64748b', fontWeight: 500, margin: 0 }}>
                    {formattedDate}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
                maxWidth: 1200
            }}>
                {features.map((f) => (
                    <div
                        key={f.key}
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            padding: 24,
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                        }}
                    >
                        <div style={{
                            width: 48,
                            height: 48,
                            background: '#0f172a',
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            marginBottom: 20
                        }}>
                            {f.icon}
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                            {f.title}
                        </h3>
                        <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

