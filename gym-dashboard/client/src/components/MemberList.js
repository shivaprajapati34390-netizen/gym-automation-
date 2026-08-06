import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AttendanceCalendar from './AttendanceCalendar';

const API = 'https://fitness-planet-backend.onrender.com';

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
  switch (member.membershipType) {
    case 'Yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
    case 'HalfYearly':
      d.setMonth(d.getMonth() + 6);
      break;
    case 'Quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    default:
      d.setMonth(d.getMonth() + 1);
  }
  return d;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  });
}

function formatBirthday(d) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata',
  });
}

function formatMembershipType(t) {
  if (t === 'HalfYearly') return 'Half-Yearly';
  return t;
}

function MemberList({ refreshMembers, onCountChange, searchTerm }) {
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [attendance, setAttendance] = useState({});
  const [calendarFor, setCalendarFor] = useState(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API}/api/members`);
      setMembers(res.data);
      if (onCountChange) onCountChange(res.data.length);
      res.data.forEach((m) => fetchAttendanceCount(m._id));
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchAttendanceCount = async (memberId) => {
    try {
      const res = await axios.get(`${API}/api/attendance/${memberId}`);
      setAttendance((prev) => ({ ...prev, [memberId]: res.data.count }));
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const markPresent = async (memberId) => {
    try {
      await axios.post(`${API}/api/attendance/${memberId}`);
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
      await axios.delete(`${API}/api/members/${id}`);
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
      dob: m.dob ? toDateInputValue(m.dob) : '',
      registrationFee: m.registrationFee || '',
      membershipFee: m.membershipFee || '',
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
      if (!payload.expiryOverride) payload.expiryOverride = null;
      if (!payload.dob) payload.dob = null;
      await axios.put(`${API}/api/members/${id}`, payload);
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
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly (3 months)</option>
                <option value="HalfYearly">Half-Yearly (6 months)</option>
                <option value="Yearly">Yearly</option>
              </select>
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Join date</label>
              <input name="joinDate" type="date" value={editForm.joinDate} onChange={handleEditChange} />
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Expiry date (leave blank for auto-calculated)</label>
              <input name="expiryOverride" type="date" value={editForm.expiryOverride} onChange={handleEditChange} />
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Date of birth</label>
              <input name="dob" type="date" value={editForm.dob} onChange={handleEditChange} />
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Registration fee (?)</label>
              <input name="registrationFee" type="number" value={editForm.registrationFee} onChange={handleEditChange} />
              <label style={{ color: '#8A8C92', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>Membership fee (?)</label>
              <input name="membershipFee" type="number" value={editForm.membershipFee} onChange={handleEditChange} />
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
              <div className="member-badge">{m.membershipType?.[0] || 'M'}</div>
              <span className="status-tag">{isExpiring ? 'Expiring' : 'Active'}</span>
            </div>
            <p className="member-name">{m.name}</p>
            <p className="member-meta">{m.contact} · {formatMembershipType(m.membershipType)}</p>
            <p className="member-meta">Joined: {formatDate(m.joinDate)}</p>
            <p className="member-meta">Expires: {formatDate(expiry)}{m.expiryOverride ? ' (manual)' : ''}</p>
            {m.dob && <p className="member-meta">Birthday: {formatBirthday(m.dob)}</p>}
            {(m.registrationFee > 0 || m.membershipFee > 0) && (
              <p className="member-meta">
                Fee: ?{m.membershipFee || 0}{m.registrationFee > 0 ? ` (+?${m.registrationFee} reg.)` : ''}
              </p>
            )}
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
