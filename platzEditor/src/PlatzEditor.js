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
    geschlecht: '',
    jugend: '',
    tag: 'Montag',
    platz: 'KS1',
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
      updated[selected] = form;
    } else {
      updated.push(form);
    }
    setTeams(updated);
    setForm({
      teamname: '', zeit: '', geschlecht: '', jugend: '', tag: 'Montag', platz: 'KS1', position: { x: 50, y: 50 }, size: { width: 120, height: 80 }, color: '#3b82f6'
    });
    setSelected(null);
  };

  const editTeam = (index) => {
    setForm(teams[index]);
    setSelected(index);
  };

  const deleteTeam = (index) => {
    const updated = teams.filter((_, i) => i !== index);
    setTeams(updated);
    if (selected === index) {
      setForm({ teamname: '', zeit: '', geschlecht: '', jugend: '', tag: 'Montag', platz: 'KS1', position: { x: 50, y: 50 }, size: { width: 120, height: 80 }, color: '#3b82f6' });
      setSelected(null);
    }
  };

  const fields = ['KS1', 'KS2', 'Rasen'];
  const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  const updateDrag = (index, data) => {
    const updated = [...teams];
    updated[index].position = { x: data.x, y: data.y };
    setTeams(updated);
  };

  const updateSize = (index, key, value) => {
    const updated = [...teams];
    updated[index].size[key] = parseInt(value);
    setTeams(updated);
  };

  const visibleTeams = teams.filter(t => t.tag === selectedDay && (selectedTeamView === 'Alle' || selectedTeamView === t.teamname));

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Team erstellen / bearbeiten</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input placeholder="Teamname" value={form.teamname} onChange={e => setForm({ ...form, teamname: e.target.value })} />
          <input placeholder="Trainingszeit" value={form.zeit} onChange={e => setForm({ ...form, zeit: e.target.value })} />
          <input placeholder="Geschlecht" value={form.geschlecht} onChange={e => setForm({ ...form, geschlecht: e.target.value })} />
          <input placeholder="Jugend (z. B. D1)" value={form.jugend} onChange={e => setForm({ ...form, jugend: e.target.value })} />
          <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
            {weekdays.map(day => <option key={day}>{day}</option>)}
          </select>
          <select value={form.platz} onChange={e => setForm({ ...form, platz: e.target.value })}>
            {fields.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
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
          {teams.map(t => <option key={t.teamname}>{t.teamname}</option>)}
        </select>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {fields.map(feld => (
            <div key={feld} style={{ position: 'relative', backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/4/45/Football_field.svg)', backgroundSize: 'cover', backgroundPosition: 'center', height: 740, borderRadius: '1rem', padding: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#111827', backgroundColor: 'rgba(255,255,255,0.8)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block' }}>{feld}</h3>
              {visibleTeams.filter(t => t.platz === feld).map((t, i) => (
                <Rnd
                  key={i}
                  bounds="parent"
                  size={{ width: t.size.width, height: t.size.height }}
                  position={t.position}
                  onDragStop={(_, d) => updateDrag(i, d)}
                  onResizeStop={(_, __, ref, __delta, pos) => {
                    updateSize(i, 'width', parseInt(ref.style.width));
                    updateSize(i, 'height', parseInt(ref.style.height));
                    updateDrag(i, pos);
                  }}
                  style={{
                    backgroundColor: t.color,
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'move',
                    zIndex: 10
                  }}
                >
                  <div>
                    {t.teamname}<br />
                    {t.zeit}
                  </div>
                </Rnd>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
