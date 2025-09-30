// frontend/src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function AdminDashboard() {
  const [elections, setElections] = useState([]);
  const [loadingVotes, setLoadingVotes] = useState({}); // e.g., { "id1": true }

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const res = await api.get('/elections/context/school');
      const electionList = res.data.data || [];
      setElections(electionList);

      // Load vote counts for each election
      electionList.forEach(election => {
        loadVoteCount(election.id);
      });
    } catch (err) {
      toast.error('Failed to load elections');
    }
  };

  const loadVoteCount = async (electionId) => {
    setLoadingVotes(prev => ({ ...prev, [electionId]: true }));
    try {
      const res = await api.get(`/votes/results/${electionId}`);
      if (res.data.success && res.data.data?.[0]) {
        const voteCount = res.data.data[0].total_votes || 0;
        setElections(prev => 
          prev.map(e => 
            e.id === electionId ? { ...e, voteCount } : e
          )
        );
      }
    } catch (err) {
      console.error('Failed to load vote count for', electionId, err);
      // Optionally show error in UI
    } finally {
      setLoadingVotes(prev => ({ ...prev, [electionId]: false }));
    }
  };

  const activateElection = async (id) => {
    try {
      await api.post(`/elections/${id}/activate`);
      toast.success('Election activated');
      loadElections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Activation failed');
    }
  };

  const closeElection = async (id) => {
    if (!window.confirm('Close this election?')) return;
    try {
      await api.post(`/elections/${id}/close`);
      toast.success('Election closed');
      loadElections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Close failed');
    }
  };

  const deleteElection = async (id) => {
    if (!window.confirm('Delete this election?')) return;
    try {
      await api.delete(`/elections/${id}`);
      toast.success('Election deleted');
      loadElections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Elections Management</h2>
        <Link to="/admin/create-election" className="btn btn-primary">Create Election</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Votes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map(e => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>
                  <span className={`badge ${
                    e.status === 'active' ? 'bg-success' :
                    e.status === 'closed' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {e.status}
                  </span>
                </td>
                <td>
                  {loadingVotes[e.id] ? 'Loading...' : e.voteCount !== undefined ? e.voteCount : '—'}
                </td>
                <td>
                  {e.status === 'scheduled' && (
                    <>
                      <button className="btn btn-sm btn-primary me-1" onClick={() => activateElection(e.id)}>Activate</button>
                      <button className="btn btn-sm btn-outline-danger me-1" onClick={() => deleteElection(e.id)}>Delete</button>
                    </>
                  )}
                  {e.status === 'active' && (
                    <button className="btn btn-sm btn-danger me-1" onClick={() => closeElection(e.id)}>Close</button>
                  )}
                  <button 
                    className="btn btn-sm btn-info" 
                    onClick={() => window.open(`/admin/results/${e.id}`, '_blank')}
                  >
                    Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}