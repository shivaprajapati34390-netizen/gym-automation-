import React, { useState } from 'react';
import axios from 'axios';

function todayLocal() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function AddMemberForm({ onMemberAdded }) {
  const today = todayLocal();
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', contact: '', membershipType: 'Monthly', joinDate: today
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://fitness-planet-backend.onrender.com/api/members', form);
      setForm({ name: '', age: '', gender: 'Male', contact: '', membershipType: 'Monthly', joinDate: today });
      onMemberAdded();
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
      <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
      <select name="gender" value={form.gender} onChange={handleChange}>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input name="contact" placeholder="Contact number" value={form.contact} onChange={handleChange} required />
      <select name="membershipType" value={form.membershipType} onChange={handleChange}>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
      <label style={{ color: '#8A8C92', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Join date</label>
      <input name="joinDate" type="date" value={form.joinDate} onChange={handleChange} required />
      <button type="submit">Add member</button>
    </form>
  );
}

export default AddMemberForm;
