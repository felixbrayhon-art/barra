import * as React from 'react';
import { useState } from 'react';
import { BulletJournalState, Habit } from '../types';

interface HabitTrackerProps {
    state: BulletJournalState;
    setState: (state: BulletJournalState) => void;
}

// ─── SVG LINE CHART ───
const LineChart: React.FC<{
    habit: Habit;
    dates: string[];
    labels: string[];
    yMin?: number | null;
    yMax?: number | null;
    yLabel?: string;
}> = ({ habit, dates, labels, yMin: customYMin, yMax: customYMax, yLabel }) => {
    const W = 700, H = 280, PAD_L = 56, PAD_R = 20, PAD_T = 20, PAD_B = 40;
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;

    const values = dates.map(d => habit.values?.[d] ?? null);
    const numericValues = values.filter(v => v !== null) as number[];
    if (numericValues.length === 0) return <p style={{ color: '#ccc', fontSize: 13, fontStyle: 'italic', padding: 20 }}>Sem dados registrados.</p>;

    const autoMax = Math.max(...numericValues, 1);
    const autoMin = Math.min(...numericValues, 0);
    const maxV = customYMax !== undefined && customYMax !== null ? customYMax : autoMax;
    const minV = customYMin !== undefined && customYMin !== null ? customYMin : autoMin;
    const range = maxV - minV || 1;

    const getX = (i: number) => PAD_L + (i / (dates.length - 1)) * chartW;
    const getY = (v: number) => PAD_T + chartH - ((v - minV) / range) * chartH;

    // Build path
    let pathD = '';
    let areaD = '';
    const dots: { x: number; y: number; v: number; label: string }[] = [];

    values.forEach((v, i) => {
        if (v === null) return;
        const x = getX(i);
        const y = getY(v);
        dots.push({ x, y, v, label: labels[i] });
        if (!pathD) { pathD = `M ${x} ${y}`; areaD = `M ${x} ${PAD_T + chartH} L ${x} ${y}`; }
        else { pathD += ` L ${x} ${y}`; areaD += ` L ${x} ${y}`; }
    });
    areaD += ` L ${dots[dots.length - 1].x} ${PAD_T + chartH} Z`;

    // Y axis labels
    const yTicks = 5;
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => minV + (range / yTicks) * i);

    return (
        <svg width={W} height={H} style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {yLabels.map((v, i) => {
                const y = getY(v);
                return <g key={i}>
                    <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#f0f0f0" strokeWidth={1} />
                    <text x={PAD_L - 8} y={y + 4} textAnchor="end" fill="#aaa" fontSize={10} fontWeight={600}>{v % 1 === 0 ? v : v.toFixed(1)}</text>
                </g>;
            })}
            {/* Y axis label (rotated) */}
            {yLabel && (
                <text x={12} y={PAD_T + chartH / 2} textAnchor="middle" fill="#bbb" fontSize={10} fontWeight={700}
                    transform={`rotate(-90, 12, ${PAD_T + chartH / 2})`}>{yLabel}</text>
            )}
            {/* Area fill */}
            <path d={areaD} fill="#000" opacity={0.04} />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {dots.map((d, i) => (
                <g key={i}>
                    <circle cx={d.x} cy={d.y} r={4} fill="#fff" stroke="#000" strokeWidth={2} />
                    <title>{d.label}: {d.v} {yLabel || ''}</title>
                </g>
            ))}
            {/* X labels */}
            {labels.filter((_, i) => dates.length <= 14 || i % Math.ceil(dates.length / 10) === 0).map((label, i, arr) => {
                const origIdx = dates.length <= 14 ? i : i * Math.ceil(dates.length / 10);
                if (origIdx >= dates.length) return null;
                const x = getX(origIdx);
                return <text key={i} x={x} y={H - 4} textAnchor="middle" fill="#aaa" fontSize={9} fontWeight={600}>{label}</text>;
            })}
        </svg>
    );
};

// ─── MAIN COMPONENT ───
export const HabitTracker: React.FC<HabitTrackerProps> = ({ state, setState }) => {
    const [newHabit, setNewHabit] = useState('');
    const [newType, setNewType] = useState<'boolean' | 'numeric'>('boolean');
    const [newUnit, setNewUnit] = useState('horas');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [view, setView] = useState<'grid' | 'chart'>('grid');
    const [chartRange, setChartRange] = useState<'week' | 'month' | 'year'>('month');
    const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<{ habitId: string; date: string } | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [customYMin, setCustomYMin] = useState<string>('');
    const [customYMax, setCustomYMax] = useState<string>('');
    const [customYLabel, setCustomYLabel] = useState<string>('');

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];
    const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const MONTHS_FULL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const addHabit = () => {
        if (!newHabit.trim()) return;
        const habit: Habit = {
            id: crypto.randomUUID(), name: newHabit.trim(), color: '#000',
            completions: [], trackType: newType,
            unit: newType === 'numeric' ? newUnit : undefined,
            values: newType === 'numeric' ? {} : undefined,
        };
        setState({ ...state, habits: [...state.habits, habit] });
        setNewHabit('');
    };

    const removeHabit = (id: string) => {
        setState({ ...state, habits: state.habits.filter(h => h.id !== id) });
        if (selectedHabit === id) setSelectedHabit(null);
    };

    const editHabitName = (id: string, name: string) => {
        setState({ ...state, habits: state.habits.map(h => h.id === id ? { ...h, name } : h) });
    };

    const editHabitUnit = (id: string, unit: string) => {
        setState({ ...state, habits: state.habits.map(h => h.id === id ? { ...h, unit } : h) });
    };

    const toggleDay = (habitId: string, day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setState({
            ...state,
            habits: state.habits.map(h => {
                if (h.id !== habitId) return h;
                if (h.trackType === 'numeric') return h; // don't toggle numeric
                const has = h.completions.includes(dateStr);
                return { ...h, completions: has ? h.completions.filter(d => d !== dateStr) : [...h.completions, dateStr] };
            })
        });
    };

    const setNumericValue = (habitId: string, dateStr: string, value: number) => {
        setState({
            ...state,
            habits: state.habits.map(h => {
                if (h.id !== habitId) return h;
                const vals = { ...(h.values || {}), [dateStr]: value };
                return { ...h, values: vals };
            })
        });
        setEditingValue(null);
    };

    const removeNumericValue = (habitId: string, dateStr: string) => {
        setState({
            ...state,
            habits: state.habits.map(h => {
                if (h.id !== habitId) return h;
                const vals = { ...(h.values || {}) };
                delete vals[dateStr];
                return { ...h, values: vals };
            })
        });
    };

    const getStreak = (habit: Habit) => {
        if (habit.trackType === 'numeric') {
            let streak = 0;
            const d = new Date();
            while (true) {
                const ds = d.toISOString().split('T')[0];
                if (habit.values?.[ds] !== undefined) { streak++; d.setDate(d.getDate() - 1); }
                else break;
            }
            return streak;
        }
        let streak = 0;
        const d = new Date();
        while (true) {
            const ds = d.toISOString().split('T')[0];
            if (habit.completions.includes(ds)) { streak++; d.setDate(d.getDate() - 1); }
            else break;
        }
        return streak;
    };

    // Chart dates
    const getChartDates = (): { dates: string[]; labels: string[] } => {
        const dates: string[] = [];
        const labels: string[] = [];
        const now = new Date();

        if (chartRange === 'week') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                dates.push(d.toISOString().split('T')[0]);
                labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3));
            }
        } else if (chartRange === 'month') {
            const dim = new Date(currentYear, currentMonth + 1, 0).getDate();
            for (let i = 1; i <= dim; i++) {
                const ds = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                dates.push(ds);
                labels.push(String(i));
            }
        } else { // year
            for (let m = 0; m < 12; m++) {
                const dim = new Date(currentYear, m + 1, 0).getDate();
                for (let d = 1; d <= dim; d++) {
                    const ds = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    dates.push(ds);
                    labels.push(d === 1 ? MONTHS[m] : '');
                }
            }
        }
        return { dates, labels };
    };

    const activeHabit = state.habits.find(h => h.id === selectedHabit);

    return (
        <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: '48px 48px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Hábitos</h1>
                    <p style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>{MONTHS_FULL[currentMonth]} {currentYear}</p>
                </div>
                {/* View Toggle */}
                <div style={{ display: 'flex', gap: 4, background: '#fafafa', borderRadius: 10, padding: 3, border: '1px solid #eee' }}>
                    <button onClick={() => setView('grid')}
                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: view === 'grid' ? '#000' : 'transparent', color: view === 'grid' ? '#fff' : '#aaa', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Inter'" }}>
                        ▦ Grid
                    </button>
                    <button onClick={() => setView('chart')}
                        style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: view === 'chart' ? '#000' : 'transparent', color: view === 'chart' ? '#fff' : '#aaa', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Inter'" }}>
                        📈 Gráfico
                    </button>
                </div>
            </div>

            {/* Month Nav */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }}
                    style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}>←</button>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }}
                    style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}>→</button>
            </div>

            {/* Add Habit */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                <select value={newType} onChange={e => setNewType(e.target.value as any)}
                    style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter'" }}>
                    <option value="boolean">✓ Sim/Não</option>
                    <option value="numeric">📊 Numérico</option>
                </select>
                <input value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()}
                    placeholder="Nome do hábito..." style={{ flex: 1, minWidth: 150, padding: '10px 14px', background: '#fafafa', border: '1px solid #eee', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Inter'" }} />
                {newType === 'numeric' && (
                    <input value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="Unidade (horas, km...)"
                        style={{ width: 120, padding: '10px 14px', background: '#fafafa', border: '1px solid #eee', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: "'Inter'" }} />
                )}
                <button onClick={addHabit} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+</button>
            </div>

            {state.habits.length === 0 && <p style={{ color: '#ccc', fontSize: 13, fontStyle: 'italic' }}>Adicione seu primeiro hábito acima.</p>}

            {/* ─── GRID VIEW ─── */}
            {view === 'grid' && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#aaa', width: 180, position: 'sticky', left: 0, background: '#fff' }}>Hábito</th>
                                {Array.from({ length: daysInMonth }, (_, i) => (
                                    <th key={i} style={{ padding: 4, fontSize: 10, fontWeight: 600, color: '#ccc', textAlign: 'center', minWidth: 28 }}>{i + 1}</th>
                                ))}
                                <th style={{ padding: '8px', fontSize: 11, fontWeight: 700, color: '#aaa', textAlign: 'center' }}>🔥</th>
                                <th style={{ width: 28 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.habits.map(habit => (
                                <tr key={habit.id}>
                                    <td style={{ padding: '6px 12px', position: 'sticky', left: 0, background: '#fff' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <input value={habit.name} onChange={e => editHabitName(habit.id, e.target.value)}
                                                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'Inter'", width: '100%' }} />
                                            {habit.trackType === 'numeric' && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <span style={{ fontSize: 10, color: '#ccc' }}>📊</span>
                                                    <input value={habit.unit || ''} onChange={e => editHabitUnit(habit.id, e.target.value)}
                                                        placeholder="unidade" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 10, color: '#aaa', fontFamily: "'Inter'", width: 60 }} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    {Array.from({ length: daysInMonth }, (_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isToday = dateStr === today;

                                        if (habit.trackType === 'numeric') {
                                            const val = habit.values?.[dateStr];
                                            const isEditing = editingValue?.habitId === habit.id && editingValue?.date === dateStr;
                                            return (
                                                <td key={i} style={{ padding: 1, textAlign: 'center' }}>
                                                    {isEditing ? (
                                                        <input autoFocus value={inputValue} onChange={e => setInputValue(e.target.value)}
                                                            onBlur={() => { if (inputValue) setNumericValue(habit.id, dateStr, parseFloat(inputValue)); else setEditingValue(null); }}
                                                            onKeyDown={e => { if (e.key === 'Enter' && inputValue) setNumericValue(habit.id, dateStr, parseFloat(inputValue)); if (e.key === 'Escape') setEditingValue(null); }}
                                                            style={{ width: 28, height: 24, borderRadius: 4, border: '1px solid #000', background: '#fff', fontSize: 10, textAlign: 'center', outline: 'none', fontFamily: "'Inter'" }} />
                                                    ) : (
                                                        <button onClick={() => { setEditingValue({ habitId: habit.id, date: dateStr }); setInputValue(val !== undefined ? String(val) : ''); }}
                                                            onContextMenu={e => { e.preventDefault(); if (val !== undefined) removeNumericValue(habit.id, dateStr); }}
                                                            style={{
                                                                width: 28, height: 24, borderRadius: 4,
                                                                border: isToday ? '2px solid #000' : '1px solid #e5e5e5',
                                                                background: val !== undefined ? '#000' : '#fff',
                                                                color: val !== undefined ? '#fff' : '#ccc',
                                                                cursor: 'pointer', fontSize: 9, fontWeight: 700, fontFamily: "'Inter'"
                                                            }}>
                                                            {val !== undefined ? val : ''}
                                                        </button>
                                                    )}
                                                </td>
                                            );
                                        }

                                        // Boolean habit
                                        const done = habit.completions.includes(dateStr);
                                        return (
                                            <td key={i} style={{ padding: 2, textAlign: 'center' }}>
                                                <button onClick={() => toggleDay(habit.id, day)}
                                                    style={{
                                                        width: 24, height: 24, borderRadius: 6,
                                                        border: isToday ? '2px solid #000' : '1px solid #e5e5e5',
                                                        background: done ? '#000' : '#fff', cursor: 'pointer', transition: 'all 0.15s'
                                                    }} />
                                            </td>
                                        );
                                    })}
                                    <td style={{ textAlign: 'center', fontSize: 13, fontWeight: 800 }}>{getStreak(habit)}</td>
                                    <td>
                                        <button onClick={() => removeHabit(habit.id)} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: 12 }}>✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ─── CHART VIEW ─── */}
            {view === 'chart' && (
                <div>
                    {/* Range selector */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fafafa', borderRadius: 10, padding: 3, border: '1px solid #eee', width: 'fit-content' }}>
                        {(['week', 'month', 'year'] as const).map(r => (
                            <button key={r} onClick={() => setChartRange(r)}
                                style={{
                                    padding: '6px 16px', borderRadius: 8, border: 'none',
                                    background: chartRange === r ? '#000' : 'transparent',
                                    color: chartRange === r ? '#fff' : '#aaa',
                                    fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Inter'"
                                }}>
                                {r === 'week' ? 'Semana' : r === 'month' ? 'Mês' : 'Ano'}
                            </button>
                        ))}
                    </div>

                    {/* Habit selector */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                        {state.habits.map(h => (
                            <button key={h.id} onClick={() => setSelectedHabit(h.id)}
                                style={{
                                    padding: '8px 16px', borderRadius: 10,
                                    background: selectedHabit === h.id ? '#000' : '#fafafa',
                                    color: selectedHabit === h.id ? '#fff' : '#555',
                                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                    border: selectedHabit === h.id ? 'none' : '1px solid #eee',
                                    fontFamily: "'Inter'"
                                }}>
                                {h.trackType === 'numeric' ? '📊' : '✓'} {h.name} {h.unit ? `(${h.unit})` : ''}
                            </button>
                        ))}
                    </div>

                    {/* Chart */}
                    {activeHabit ? (
                        <div style={{ background: '#fafafa', borderRadius: 16, padding: '24px 24px 16px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{activeHabit.name}</h3>
                                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                                        Eixo X: {chartRange === 'week' ? 'dias (semana)' : chartRange === 'month' ? 'dias (mês)' : 'meses (ano)'}
                                    </p>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 800 }}>🔥 {getStreak(activeHabit)}</div>
                            </div>

                            {/* Y-Axis Controls */}
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>Eixo Y:</span>
                                <input value={customYLabel} onChange={e => setCustomYLabel(e.target.value)}
                                    placeholder={activeHabit.unit || 'Rótulo (ex: horas)'}
                                    style={{ width: 120, padding: '6px 10px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 12, outline: 'none', fontFamily: "'Inter'" }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 11, color: '#bbb' }}>Min:</span>
                                    <input value={customYMin} onChange={e => setCustomYMin(e.target.value)} type="number" placeholder="auto"
                                        style={{ width: 60, padding: '6px 8px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 12, outline: 'none', textAlign: 'center', fontFamily: "'Inter'" }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 11, color: '#bbb' }}>Max:</span>
                                    <input value={customYMax} onChange={e => setCustomYMax(e.target.value)} type="number" placeholder="auto"
                                        style={{ width: 60, padding: '6px 8px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 12, outline: 'none', textAlign: 'center', fontFamily: "'Inter'" }} />
                                </div>
                            </div>

                            {activeHabit.trackType === 'numeric' ? (
                                <LineChart habit={activeHabit} {...getChartDates()}
                                    yMin={customYMin ? parseFloat(customYMin) : null}
                                    yMax={customYMax ? parseFloat(customYMax) : null}
                                    yLabel={customYLabel || activeHabit.unit || ''} />
                            ) : (
                                (() => {
                                    const { dates, labels } = getChartDates();
                                    const tempHabit: Habit = {
                                        ...activeHabit,
                                        trackType: 'numeric',
                                        values: Object.fromEntries(dates.map(d => [d, activeHabit.completions.includes(d) ? 1 : 0]))
                                    };
                                    return <LineChart habit={tempHabit} dates={dates} labels={labels}
                                        yMin={customYMin ? parseFloat(customYMin) : null}
                                        yMax={customYMax ? parseFloat(customYMax) : null}
                                        yLabel={customYLabel || 'completado'} />;
                                })()
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: 40, textAlign: 'center', color: '#ccc', fontSize: 14 }}>
                            Selecione um hábito acima para ver o gráfico
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
