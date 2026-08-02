import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AttendanceCalendar from './AttendanceCalendar';

function toDateInputValue(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getExpiryDate(member) {
  if (member.expiryOverride) {
    return new Date(member.expiryOverride);
  }
  const d = new Date(member.joinDate);
  if (member.membershipType === 'Yearly') {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

function MemberList({ refreshMembers, onCountChange, searchTerm }) {
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [attendance, setAttendance] = useState({});
  const [calendarFor, setCalendarFor] = useState(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/members');
      setMembers(res.data);
      if (onCountChange) onCountChange(res.data.length);
      res.data.forEach((m) => fetchAttendanceCount(m._id));
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchAttendanceCount = async (memberId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/${memberId}`);
      setAttendance((prev) => ({ ...prev, [memberId]: res.data.count }));
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const markPresent = async (memberId) => {
    try {
      await axios.post(`http://localhost:5000/api/attendance/${memberId}`);
      fetchAttendanceCount(memberId);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('Already marked present today');
      } else {
        console.error('Error marking attendance:', err);
      }
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/members/${id}`);
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  const startEdit = (m) => {
    setEditingId(m._id);
    setEditForm({
      name: m.name,
      age: m.age,
      gender: m.gender,
      contact: m.contact,
      membershipType: m.membershipType,
      joinDate: toDateInputValue(m.joinDate),
      expiryOverride: m.expiryOverride ? toDateInputValue(m.expiryOverride) : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const payload = { ...editForm };
      if (!payload.expiryOverride) {
        payload.expiryOverride = null;
      }
      await axios.put(`http://localhost:5000/api/members/${id}`, payload);
      setEditingId(null);
      fetchMembers();
    } catch (err) {
      console.error('Error updating member:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshMembers]);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="members-grid">
      {filteredMembers.map((m) => {
        const expiry = getExpiryDate(m);
        const isExpiring = expiry - new Date() < 5 * 24 * 60 * 60 * 1000;
        const cardClass = `member-card ${m.membershipType === 'Yearly' ? 'yearly' : ''} ${isExpiring ? 'expiring' : ''}`;

        if (editingId === m._id) {
          return (
            <div key={m._id} className="member-card">
              <input name="name" value={editForm.name} onChange={handleEditChange} />
              <input name="age" type="number" value={editForm.age} onChange={handleEditChange} />
              <select name="gender" value={editForm.gender} onChange={handleEditChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input name="contact" value={editForm.contact} onChange={handleEditChange} />
              <select name="membershipType" value={editForm.membershipType} onChange={handleEditChange}>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Join date</label>
              <input name="joinDate" type="date" value={editForm.joinDate} onChange={handleEditChange} />
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Expiry date (leave blank for auto-calculated)</label>
              <input name="expiryOverride" type="date" value={editForm.expiryOverride} onChange={handleEditChange} />
              <div className="member-actions">
                <button onClick={() => saveEdit(m._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          );
        }

        return (
          <div key={m._id} className={cardClass}>
            <div className="member-card-top">
              <div className="member-badge">{m.membershipType === 'Yearly' ? 'Y' : 'M'}</div>
              <span className="status-tag">{isExpiring ? 'Expiring' : 'Active'}</span>
            </div>
            <p className="member-name">{m.name}</p>
            <p className="member-meta">{m.contact} · {m.membershipType}</p>
            <p className="member-meta">Joined: {formatDate(m.joinDate)}</p>
            <p className="member-meta">Expires: {formatDate(expiry)}{m.expiryOverride ? ' (manual)' : ''}</p>
            <p className="member-meta">Days present: {attendance[m._id] ?? '...'}</p>
            <div className="member-actions">
              <button onClick={() => markPresent(m._id)}>Mark present</button>
              <button onClick={() => setCalendarFor(calendarFor === m._id ? null : m._id)}>Calendar</button>
              <button onClick={() => startEdit(m)}>Edit</button>
              <button onClick={() => deleteMember(m._id)}>Remove</button>
            </div>
            {calendarFor === m._id && (
              <AttendanceCalendar memberId={m._id} onClose={() => setCalendarFor(null)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MemberList;
