import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import './index.css';

export default function PlatzEditor() {
  const [teams, setTeams] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Montag');
  const [selectedTeamView, setSelectedTeamView] = useState('Alle');
  const [form, setForm] = useState({
    teamname: '',
    zeit: '',
    jugend: '',
    tage: ['Montag'],
    platz: 'KS2',
    position: { x: 50, y: 50 },
    size: { width: 120, height: 80 },
    color: '#3b82f6'
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/byRafi/fcperlach/main/Teamdaten.json')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error('Ladefehler:', err));
  }, []);

  const saveTeam = () => {
    let updated = [...teams];
    if (selected !== null) {
      updated = updated.map(t => (t.id === form.id ? form : t));
    } else {
      updated.push({ ...form, id: Date.now() });
    }
    setTeams(updated);
    setForm({
      teamname: '', zeit: '', jugend: '', tage: ['Montag'], platz: 'KS2', position: { x: 50, y: 50 }, size: { width: 120, height: 80 }, color: '#3b82f6'
    });
    setSelected(null);
  };

  const editTeam = (team) => {
    setForm(team);
    setSelected(team.id);
  };

  const deleteTeam = (id) => {
    const updated = teams.filter((t) => t.id !== id);
    setTeams(updated);
    if (selected === id) {
      setForm({ teamname: '', zeit: '', jugend: '', tage: ['Montag'], platz: 'KS2', position: { x: 50, y: 50 }, size: { width: 120, height: 80 }, color: '#3b82f6' });
      setSelected(null);
    }
  };

  const updateById = (id, callback) => {
    const updated = teams.map(t => t.id === id ? callback(t) : t);
    setTeams(updated);
  };

  const updateDrag = (id, data) => {
    updateById(id, t => ({ ...t, position: { x: data.x, y: data.y } }));
  };

  const updateSize = (id, key, value) => {
    updateById(id, t => ({
      ...t,
      size: {
        ...t.size,
        [key]: parseInt(value)
      }
    }));
  };

  const toggleDayInForm = (day) => {
    setForm((prev) => {
      const tage = prev.tage.includes(day)
        ? prev.tage.filter((d) => d !== day)
        : [...prev.tage, day];
      return { ...prev, tage };
    });
  };

  const fields = ['KS2', 'KS1', 'Rasen'];
  const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const colors = [
    { name: 'Blau', hex: '#3b82f6' },
    { name: 'Grün', hex: '#10b981' },
    { name: 'Orange', hex: '#f59e0b' },
    { name: 'Rot', hex: '#ef4444' },
    { name: 'Lila', hex: '#6366f1' }
  ];

  const visibleTeams = teams.filter(t => t.tage.includes(selectedDay) && (selectedTeamView === 'Alle' || selectedTeamView === t.teamname));

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Team erstellen / bearbeiten</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input placeholder="Trainer" value={form.teamname} onChange={e => setForm({ ...form, teamname: e.target.value })} />
          <input placeholder="Trainingszeit" value={form.zeit} onChange={e => setForm({ ...form, zeit: e.target.value })} />
          <input placeholder="Jugend (z. B. D1)" value={form.jugend} onChange={e => setForm({ ...form, jugend: e.target.value })} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {weekdays.map(day => (
              <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input type="checkbox" checked={form.tage.includes(day)} onChange={() => toggleDayInForm(day)} /> {day}
              </label>
            ))}
          </div>
          <select value={form.platz} onChange={e => setForm({ ...form, platz: e.target.value })}>
            {fields.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}>
            {colors.map(c => (
              <option key={c.hex} value={c.hex}>{c.name}</option>
            ))}
          </select>
          <button onClick={saveTeam} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none' }}>{selected !== null ? 'Team aktualisieren' : 'Team speichern'}</button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
          {weekdays.map(day => <option key={day}>{day}</option>)}
        </select>
        <select value={selectedTeamView} onChange={e => setSelectedTeamView(e.target.value)}>
          <option value="Alle">Alle Teams</option>
          {teams.map(t => <option key={t.id}>{t.teamname}</option>)}
        </select>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          {fields.map(feld => (
            <div key={feld}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#111827' }}>{feld}</h3>
              <div style={{ position: 'relative', backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/4/45/Football_field.svg)', backgroundSize: 'cover', backgroundPosition: 'center', height: 740, borderRadius: '1rem', padding: '1rem' }}>
                {visibleTeams.filter(t => t.platz === feld).map((t) => (
                  <Rnd
                    key={t.id}
                    bounds="parent"
                    size={{ width: t.size.width, height: t.size.height }}
                    position={t.position}
                    onDragStop={(_, d) => updateDrag(t.id, d)}
                    onResizeStop={(_, __, ref, __delta, pos) => {
                      updateSize(t.id, 'width', parseInt(ref.style.width));
                      updateSize(t.id, 'height', parseInt(ref.style.height));
                      updateDrag(t.id, pos);
                    }}
                    style={{
                      backgroundColor: t.color,
                      color: 'white',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'move',
                      zIndex: 10,
                      position: 'absolute'
                    }}
                  >
                    <div>
                      {t.jugend}<br />
                      {t.zeit}<br />
                      <strong>{t.teamname}</strong>
                    </div>
                  </Rnd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
