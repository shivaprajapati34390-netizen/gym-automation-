import React, { useState } from 'react';
import AddMemberForm from './components/AddMemberForm';
import MemberList from './components/MemberList';
import './App.css';

function App() {
  const [refreshMembers, setRefreshMembers] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMemberAdded = () => {
    setRefreshMembers(!refreshMembers);
  };

  return (
    <div className="app">
      <div className="masthead">
        <h1>Fitness Planet</h1>
        <span className="stats">{memberCount} members</span>
      </div>
      <div className="panel">
        <h2>Add member</h2>
        <AddMemberForm onMemberAdded={handleMemberAdded} />
      </div>
      <input
        className="search-bar"
        type="text"
        placeholder="Search members by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <MemberList refreshMembers={refreshMembers} onCountChange={setMemberCount} searchTerm={searchTerm} />
    </div>
  );
}

export default App;
