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
    fetch('https://raw.githubusercontent.com/byRafi/fcperlach/refs/heads/main/Teamdaten.json')
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
    <div style={{ padding: 20 }}>
      <h2>Team erstellen / bearbeiten</h2>
      <input placeholder="Teamname" value={form.teamname} onChange={e => setForm({ ...form, teamname: e.target.value })} />
      <input placeholder="Trainingszeit" value={form.zeit} onChange={e => setForm({ ...form, zeit: e.target.value })} />
      <input placeholder="Geschlecht" value={form.geschlecht} onChange={e => setForm({ ...form, geschlecht: e.target.value })} />
      <input placeholder="Jugend" value={form.jugend} onChange={e => setForm({ ...form, jugend: e.target.value })} />
      <select value={form.platz} onChange={e => setForm({ ...form, platz: e.target.value })}>
        {fields.map(p => <option key={p}>{p}</option>)}
      </select>
      <select value={form.feldbereich} onChange={e => setForm({ ...form, feldbereich: e.target.value })}>
        {positions.map(p => <option key={p}>{p}</option>)}
      </select>
      <button onClick={saveTeam}>{selected !== null ? 'Aktualisieren' : 'Speichern'}</button>

      <hr />

      {fields.map(feld => (
        <div key={feld}>
          <h3>{feld}</h3>
          {teams.filter(t => t.platz === feld).map((t, i) => (
            <div key={i} style={{ border: '1px solid #ccc', margin: 5, padding: 10 }}>
              <b>{t.teamname}</b> — {t.zeit} — {t.geschlecht} — {t.jugend} — {t.feldbereich}
              <div>
                <button onClick={() => editTeam(i)}>Bearbeiten</button>
                <button onClick={() => deleteTeam(i)}>Löschen</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
