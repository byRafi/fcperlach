import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelPlan = () => {
  const [day, setDay] = useState('Montag');
  const [data, setData] = useState([]);

  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

  useEffect(() => {
    const loadExcel = async () => {
      const res = await fetch('/Trainingsplan.xlsx');
      const ab = await res.arrayBuffer();
      const wb = XLSX.read(ab, { type: 'array' });
      const sheet = wb.Sheets[day];
      if (sheet) {
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData);
      } else {
        setData([]);
      }
    };

    loadExcel();
  }, [day]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Trainingsplan ({day})</h2>
      <select value={day} onChange={(e) => setDay(e.target.value)}>
        {days.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      {data.length > 0 ? (
        <table border="1" cellPadding="10" style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: '1rem' }}>Kein Plan gefunden für {day}</p>
      )}
    </div>
  );
};

export default ExcelPlan;
