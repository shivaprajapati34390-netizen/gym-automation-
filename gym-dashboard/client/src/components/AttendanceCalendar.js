import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceCalendar({ memberId, onClose }) {
  const [presentDays, setPresentDays] = useState([]);
  const [monthCount, setMonthCount] = useState(0);
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);

  useEffect(() => {
    const fetchMonth = async () => {
      try {
        const res = await axios.get(
          `https://fitness-planet-backend.onrender.com/api/attendance/${memberId}/month/${year}/${month}`
        );
        setPresentDays(res.data.days);
        setMonthCount(res.data.count);
      } catch (err) {
        console.error('Error fetching monthly attendance:', err);
      }
    };
    fetchMonth();
  }, [memberId, year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const monthName = new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="calendar-panel">
      <div className="calendar-header">
        <span>{monthName}</span>
        <button onClick={onClose}>Close</button>
      </div>
      <p className="member-meta">Present: {monthCount} days</p>
      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`h-${i}`} className="calendar-dow">{d}</div>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <div key={i} className="calendar-cell empty" />
          ) : (
            <div key={i} className={`calendar-cell ${presentDays.includes(d) ? 'present' : ''}`}>
              {d}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AttendanceCalendar;
