import React, { useEffect, useState } from 'react';

export default function PlatzEditor() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    teamname: '',
    zeit: '',
    geschlecht: '',
    jugend: '',
    platz: 'KS1',
    feldbereich: 'oben-links'
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
    setForm({ teamname: '', zeit: '', geschlecht: '', jugend: '', platz: 'KS1', feldbereich: 'oben-links' });
    setSelected(null);
  };

  const editTeam = (index) => {
    setForm(teams[index]);
    setSelected(index);
  };

  const deleteTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
    if (selected === index) {
      setForm({ teamname: '', zeit: '', geschlecht: '', jugend: '', platz: 'KS1', feldbereich: 'oben-links' });
      setSelected(null);
    }
  };

  const fields = ['KS1', 'KS2', 'Rasen'];
  const positions = ['oben-links', 'oben-rechts', 'unten-links', 'unten-rechts', 'mittig'];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Team erstellen / bearbeiten</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <input className="input" placeholder="Teamname" value={form.teamname} onChange={e => setForm({ ...form, teamname: e.target.value })} />
          <input className="input" placeholder="Trainingszeit" value={form.zeit} onChange={e => setForm({ ...form, zeit: e.target.value })} />
          <select className="input" value={form.geschlecht} onChange={e => setForm({ ...form, geschlecht: e.target.value })}>
            <option value="">Geschlecht</option>
            <option value="maennlich">Männlich</option>
            <option value="weiblich">Weiblich</option>
          </select>
          <input className="input" placeholder="Jugend (z. B. D1)" value={form.jugend} onChange={e => setForm({ ...form, jugend: e.target.value })} />
          <select className="input" value={form.platz} onChange={e => setForm({ ...form, platz: e.target.value })}>
            {fields.map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="input" value={form.feldbereich} onChange={e => setForm({ ...form, feldbereich: e.target.value })}>
            {positions.map(p => <option key={p}>{p}</option>)}
          </select>
          <button onClick={saveTeam} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none' }}>{selected !== null ? 'Team aktualisieren' : 'Team speichern'}</button>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {fields.map(feld => (
            <div key={feld} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#111827' }}>{feld}</h3>
              {teams.filter(t => t.platz === feld).map((t, i) => (
                <div key={i} style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold' }}>{t.teamname}</p>
                  <p>{t.zeit} | Kabine {t.kabine}</p>
                  <p>{t.geschlecht} | {t.jugend}</p>
                  <p>{t.feldbereich}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => editTeam(i)} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem', borderRadius: '0.375rem', border: 'none' }}>Bearbeiten</button>
                    <button onClick={() => deleteTeam(i)} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '0.375rem', border: 'none' }}>Löschen</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
